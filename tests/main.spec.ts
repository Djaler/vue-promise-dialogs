import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { createPromiseDialog, PromiseDialogsWrapper } from '@/index';

let wrapper: Wrapper<Vue>;

const TestDialog = Vue.extend({
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

const testDialogFunction = createPromiseDialog<{ text: string }, boolean>(TestDialog);

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

    describe('when dialog function called', () => {
        let resultPromise: Promise<boolean>;
        let dialog: Wrapper<Vue>;

        beforeEach(async () => {
            resultPromise = testDialogFunction({ text: 'Test' });

            await wrapper.vm.$nextTick();

            dialog = wrapper.findComponent(TestDialog);
        });

        afterEach(() => {
            resultPromise.catch(() => {
                // ignore
            });
        });

        it('should mount dialog component', () => {
            expect(dialog.exists()).toBe(true);
        });

        describe('when variant selected in dialog', () => {
            beforeEach(async () => {
                const button = dialog.find('button[name="true"]');
                await button.trigger('click');
            });

            it('should resolve dialog function promise', async () => {
                await expect(resultPromise).resolves.toBe(true);
            });

            it('should unmount dialog component', () => {
                expect(dialog.exists()).toBe(false);
            });
        });

        describe('when cancel variant selected in dialog', () => {
            beforeEach(async () => {
                const button = dialog.find('button[name="cancel"]');
                await button.trigger('click');
            });

            it('should reject dialog function promise', async () => {
                await expect(resultPromise).rejects.toEqual('cancel');
            });

            it('should unmount dialog component', () => {
                expect(dialog.exists()).toBe(false);
            });
        });

        describe('when dialog function called second time', () => {
            let secondResultPromise: Promise<boolean>;
            let secondDialog: Wrapper<Vue>;

            beforeEach(async () => {
                secondResultPromise = testDialogFunction({ text: 'Test' });

                await wrapper.vm.$nextTick();

                secondDialog = wrapper.findAllComponents(TestDialog).at(1);
            });

            afterEach(() => {
                secondResultPromise.catch(() => {
                    // ignore
                });
            });

            it('should mount second dialog component', () => {
                expect(secondDialog.exists()).toBe(true);
            });

            describe('when variant selected in second dialog', () => {
                beforeEach(async () => {
                    const button = secondDialog.find('button[name="true"]');
                    await button.trigger('click');
                });

                it('should resolve second dialog function promise', async () => {
                    await expect(secondResultPromise).resolves.toBe(true);
                });

                it('should unmount second dialog component', () => {
                    expect(secondDialog.exists()).toBe(false);
                });

                it('should not unmount first dialog component', () => {
                    expect(dialog.exists()).toBe(true);
                });
            });

            describe('when cancel variant selected in second dialog', () => {
                beforeEach(async () => {
                    const button = secondDialog.find('button[name="cancel"]');
                    await button.trigger('click');
                });

                it('should reject second dialog function promise', async () => {
                    await expect(secondResultPromise).rejects.toEqual('cancel');
                });

                it('should unmount second dialog component', () => {
                    expect(secondDialog.exists()).toBe(false);
                });

                it('should not unmount first dialog component', () => {
                    expect(dialog.exists()).toBe(true);
                });
            });
        });
    });

    describe('when dialog function with delay called', () => {
        const TestDialogWithDelays = Vue.extend({
            template: `
              <div>
              <p>{{ params.text }}</p>
              <button name="true" @click="$emit('resolve', true, 100)">True</button>
              <button name="false" @click="$emit('resolve', false)">False</button>
              <button name="cancel" @click="$emit('reject', 'cancel', 200)">Cancel</button>
              </div>
            `,
            props: {
                params: {
                    type: Object,
                    required: true,
                },
            },
        });

        const testDialogFunctionWithDelay = createPromiseDialog<{ text: string }, boolean>(TestDialogWithDelays, 300);

        let resultPromise: Promise<boolean>;
        let dialog: Wrapper<Vue>;

        beforeEach(async () => {
            resultPromise = testDialogFunctionWithDelay({ text: 'Test' });

            await wrapper.vm.$nextTick();

            dialog = wrapper.findComponent(TestDialogWithDelays);
        });

        afterEach(() => {
            resultPromise.catch(() => {
                // ignore
            });
        });

        describe('when variant with delay selected in dialog', () => {
            beforeEach(async () => {
                jest.useFakeTimers();

                const button = dialog.find('button[name="true"]');
                await button.trigger('click');
            });

            afterEach(() => {
                jest.useRealTimers();
            });

            it('should resolve dialog function promise', async () => {
                await expect(resultPromise).resolves.toBe(true);
            });

            it('should unmount dialog component after delay', async () => {
                expect(dialog.exists()).toBe(true);

                jest.advanceTimersByTime(100);
                await wrapper.vm.$nextTick();

                expect(dialog.exists()).toBe(false);
            });
        });

        describe('when variant without delay selected in dialog', () => {
            beforeEach(async () => {
                jest.useFakeTimers();

                const button = dialog.find('button[name="true"]');
                await button.trigger('click');
            });

            afterEach(() => {
                jest.useRealTimers();
            });

            it('should resolve dialog function promise', async () => {
                await expect(resultPromise).resolves.toBe(true);
            });

            it('should unmount dialog component after default dialog delay', async () => {
                expect(dialog.exists()).toBe(true);

                jest.advanceTimersByTime(300);
                await wrapper.vm.$nextTick();

                expect(dialog.exists()).toBe(false);
            });
        });

        describe('when cancel variant selected in dialog', () => {
            beforeEach(async () => {
                jest.useFakeTimers();

                const button = dialog.find('button[name="cancel"]');
                await button.trigger('click');
            });

            afterEach(() => {
                jest.useRealTimers();
            });

            it('should reject dialog function promise', async () => {
                await expect(resultPromise).rejects.toEqual('cancel');
            });

            it('should unmount dialog component after delay', async () => {
                expect(dialog.exists()).toBe(true);

                jest.advanceTimersByTime(200);
                await wrapper.vm.$nextTick();

                expect(dialog.exists()).toBe(false);
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
                    testDialogFunction({ text: 'test' }).catch(() => {
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
                testDialogFunction({ text: 'test' }).catch(() => {
                    // ignore
                });
            }).toThrowError('PromiseDialogsWrapper instance not found');
        });
    });
});
