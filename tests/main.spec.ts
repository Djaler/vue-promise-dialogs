import { mount, Wrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import Vue from 'vue';
import { compileToFunctions } from 'vue-template-compiler';

import { closeAllDialogs, createPromiseDialog, PromiseDialogsWrapper } from '../src';

let wrapper: Wrapper<Vue>;

const TestDialog = Vue.extend({
    ...compileToFunctions(`
      <div>
      <p>{{ params.text }}</p>
      <button name="true" @click="$emit('resolve', true)">True</button>
      <button name="false" @click="$emit('resolve', false)">False</button>
      <button name="cancel" @click="$emit('reject', 'cancel')">Cancel</button>
      </div>
    `),
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
            props: {
                unmountDelay: {
                    type: Number,
                    default: null,
                },
            },
            ...compileToFunctions(`
              <div>
              <PromiseDialogsWrapper :unmount-delay="unmountDelay"/>
              </div>
            `),
        });

        return () => {
            wrapper.destroy();
        };
    });

    describe('when dialog function called', () => {
        let resultPromise: Promise<boolean>;
        let dialog: Wrapper<Vue>;

        beforeEach(async () => {
            resultPromise = testDialogFunction({ text: 'Test' });

            await wrapper.vm.$nextTick();

            dialog = wrapper.findComponent(TestDialog);

            return () => {
                resultPromise.catch(() => {
                    // ignore
                });
            };
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

                return () => {
                    secondResultPromise.catch(() => {
                        // ignore
                    });
                };
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

            describe('when closeAllDialogs called', () => {
                const reason = 'reason';

                beforeEach(() => {
                    closeAllDialogs(reason);
                });

                it('should reject first dialog function promise', async () => {
                    await expect(resultPromise).rejects.toEqual(reason);
                });

                it('should reject second dialog function promise', async () => {
                    await expect(secondResultPromise).rejects.toEqual(reason);
                });

                it('should unmount first dialog component', () => {
                    expect(dialog.exists()).toBe(false);
                });

                it('should unmount second dialog component', () => {
                    expect(secondDialog.exists()).toBe(false);
                });
            });
        });

        describe('when closeAllDialogs called', () => {
            const reason = 'reason';

            beforeEach(() => {
                closeAllDialogs(reason);
            });

            it('should reject dialog function promise', async () => {
                await expect(resultPromise).rejects.toEqual(reason);
            });

            it('should unmount dialog component', () => {
                expect(dialog.exists()).toBe(false);
            });
        });
    });

    describe('when dialog function with delay called', () => {
        const TestDialogWithDelays = Vue.extend({
            ...compileToFunctions(`
              <div>
              <p>{{ params.text }}</p>
              <button name="true" @click="$emit('resolve', true, 100)">True</button>
              <button name="false" @click="$emit('resolve', false)">False</button>
              <button name="cancel" @click="$emit('reject', 'cancel', 200)">Cancel</button>
              </div>
            `),
            props: {
                params: {
                    type: Object,
                    required: true,
                },
            },
        });

        const testDialogFunctionWithDelay = createPromiseDialog<{ text: string }, boolean>(TestDialogWithDelays);

        let resultPromise: Promise<boolean>;
        let dialog: Wrapper<Vue>;

        beforeEach(async () => {
            await wrapper.setProps({
                unmountDelay: 300,
            });

            resultPromise = testDialogFunctionWithDelay({ text: 'Test' });

            await wrapper.vm.$nextTick();

            dialog = wrapper.findComponent(TestDialogWithDelays);

            return () => {
                resultPromise.catch(() => {
                    // ignore
                });
            };
        });

        describe('when variant with delay selected in dialog', () => {
            beforeEach(async () => {
                vitest.useFakeTimers();

                const button = dialog.find('button[name="true"]');
                await button.trigger('click');

                return () => {
                    vitest.useRealTimers();
                };
            });

            it('should resolve dialog function promise', async () => {
                await expect(resultPromise).resolves.toBe(true);
            });

            it('should unmount dialog component after delay', async () => {
                expect(dialog.exists()).toBe(true);

                vitest.advanceTimersByTime(100);
                await wrapper.vm.$nextTick();

                expect(dialog.exists()).toBe(false);
            });
        });

        describe('when variant without delay selected in dialog', () => {
            beforeEach(async () => {
                vitest.useFakeTimers();

                const button = dialog.find('button[name="true"]');
                await button.trigger('click');

                return () => {
                    vitest.useRealTimers();
                };
            });

            it('should resolve dialog function promise', async () => {
                await expect(resultPromise).resolves.toBe(true);
            });

            it('should unmount dialog component after default dialog delay', async () => {
                expect(dialog.exists()).toBe(true);

                vitest.advanceTimersByTime(300);
                await wrapper.vm.$nextTick();

                expect(dialog.exists()).toBe(false);
            });
        });

        describe('when cancel variant selected in dialog', () => {
            beforeEach(async () => {
                vitest.useFakeTimers();

                const button = dialog.find('button[name="cancel"]');
                await button.trigger('click');

                return () => {
                    vitest.useRealTimers();
                };
            });

            it('should reject dialog function promise', async () => {
                await expect(resultPromise).rejects.toEqual('cancel');
            });

            it('should unmount dialog component after delay', async () => {
                expect(dialog.exists()).toBe(true);

                vitest.advanceTimersByTime(200);
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
        const mockedConsoleError = vitest.fn();

        let anotherWrapper: Wrapper<Vue>;

        beforeEach(() => {
            const originalConsoleError = console.error;
            console.error = mockedConsoleError;

            anotherWrapper = mount({
                components: { PromiseDialogsWrapper },
                ...compileToFunctions(`
                  <div>
                  <PromiseDialogsWrapper/>
                  </div>
                `),
            });

            return () => {
                anotherWrapper.destroy();

                console.error = originalConsoleError;
            };
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
