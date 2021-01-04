import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { BasePromiseDialog, createPromiseDialog, PromiseDialogsWrapper } from '@/index';

let wrapper: Wrapper<Vue>;

const FirstTestDialog = Vue.extend({
    template: `
      <div>
      <p>{{ params.text }}</p>
      <button name="true" @click="$emit('resolve', true)">True</button>
      <button name="false" @click="$emit('resolve', false)">False</button>
      <button name="cancel" @click="$emit('reject', 'cancel')">Cancel</button>
      </div>
    `,
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
});

const firstTestDialogFunction = createPromiseDialog<{ text: string }, boolean>(FirstTestDialog);

@Component({
    template: `
      <div>
      <p>{{ params.text }}</p>
      <button name="true" @click="onTrue">True</button>
      <button name="false" @click="onFalse">False</button>
      <button name="cancel" @click="onCancel">Cancel</button>
      </div>
    `,
})
class SecondTestDialog extends BasePromiseDialog<{ text: string }, boolean> {
    onTrue() {
        this.resolve(true);
    }

    onFalse() {
        this.resolve(true);
    }

    onCancel() {
        this.reject('cancel');
    }
}

const secondTestDialogFunction = createPromiseDialog(SecondTestDialog);

describe('when PromiseDialogsWrapper mounted', () => {
    beforeEach(() => {
        wrapper = mount({
            components: { PromiseDialogsWrapper },
            template: `
              <div>
              <PromiseDialogsWrapper/>
              </div>
            `,
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('should have correct name', () => {
        expect(wrapper.findComponent(PromiseDialogsWrapper).vm.$options.name).toEqual('PromiseDialogsWrapper');
    });

    describe('when first dialog function called', () => {
        let firstResultPromise: Promise<boolean>;

        beforeEach(() => {
            firstResultPromise = firstTestDialogFunction({ text: 'Test' });
        });

        afterEach(() => {
            firstResultPromise.catch(() => {
                // ignore
            });
        });

        it('should mount first dialog component', () => {
            expect(wrapper.findComponent(FirstTestDialog).exists()).toBe(true);
        });

        describe('when second dialog function called', () => {
            let secondResultPromise: Promise<boolean>;

            beforeEach(() => {
                secondResultPromise = secondTestDialogFunction({ text: 'Test' });
            });

            afterEach(() => {
                secondResultPromise.catch(() => {
                    // ignore
                });
            });

            it('should mount second dialog component', () => {
                expect(wrapper.findComponent(SecondTestDialog).exists()).toBe(true);
            });

            describe('when variant selected in second dialog', () => {
                beforeEach(async () => {
                    const button = wrapper.findComponent(SecondTestDialog).find('button[name="true"]');
                    await button.trigger('click');
                });

                it('should resolve second dialog function promise', async () => {
                    await expect(secondResultPromise).resolves.toBe(true);
                });

                it('should unmount second dialog component', () => {
                    expect(wrapper.findComponent(SecondTestDialog).exists()).toBe(false);
                });

                it('should not unmount first dialog component', () => {
                    expect(wrapper.findComponent(FirstTestDialog).exists()).toBe(true);
                });
            });

            describe('when cancel variant selected in second dialog', () => {
                beforeEach(async () => {
                    const button = wrapper.findComponent(SecondTestDialog).find('button[name="cancel"]');
                    await button.trigger('click');
                });

                it('should reject second dialog function promise', async () => {
                    await expect(secondResultPromise).rejects.toEqual('cancel');
                });

                it('should unmount second dialog component', () => {
                    expect(wrapper.findComponent(SecondTestDialog).exists()).toBe(false);
                });

                it('should not unmount first dialog component', () => {
                    expect(wrapper.findComponent(FirstTestDialog).exists()).toBe(true);
                });
            });
        });

        describe('when variant selected in first dialog', () => {
            beforeEach(async () => {
                const button = wrapper.findComponent(FirstTestDialog).find('button[name="true"]');
                await button.trigger('click');
            });

            it('should resolve first dialog function promise', async () => {
                await expect(firstResultPromise).resolves.toBe(true);
            });

            it('should unmount first dialog component', () => {
                expect(wrapper.findComponent(FirstTestDialog).exists()).toBe(false);
            });
        });

        describe('when cancel variant selected in first dialog', () => {
            beforeEach(async () => {
                const button = wrapper.findComponent(FirstTestDialog).find('button[name="cancel"]');
                await button.trigger('click');
            });

            it('should reject first dialog function promise', async () => {
                await expect(firstResultPromise).rejects.toEqual('cancel');
            });

            it('should unmount first dialog component', () => {
                expect(wrapper.findComponent(FirstTestDialog).exists()).toBe(false);
            });
        });
    });

    describe('when PromiseDialogsWrapper unmounted', () => {
        beforeEach(() => {
            wrapper.destroy();
        });

        describe('when dialog function called', () => {
            it('should throw error', () => {
                expect(() => {
                    firstTestDialogFunction({ text: 'test' }).catch(() => {
                        // ignore
                    });
                }).toThrowError('PromiseDialogsWrapper instance not found');
            });
        });
    });

    describe('when another PromiseDialogsWrapper mounted', () => {
        const originalConsoleError = console.error;
        const mockedConsoleError = jest.fn();

        let anotherWrapper: Wrapper<Vue>;

        beforeEach(() => {
            console.error = mockedConsoleError;

            anotherWrapper = mount({
                components: { PromiseDialogsWrapper },
                template: `
                  <div>
                  <PromiseDialogsWrapper/>
                  </div>
                `,
            });
        });

        afterEach(() => {
            anotherWrapper.destroy();

            console.error = originalConsoleError;
        });

        it('should log error', () => {
            expect(mockedConsoleError).toHaveBeenCalledWith('PromiseDialogsWrapper instance already exists');
        });
    });
});

describe('when PromiseDialogsWrapper not mounted', () => {
    describe('when dialog function called', () => {
        it('should throw error', () => {
            expect(() => {
                firstTestDialogFunction({ text: 'test' }).catch(() => {
                    // ignore
                });
            }).toThrowError('PromiseDialogsWrapper instance not found');
        });
    });
});
