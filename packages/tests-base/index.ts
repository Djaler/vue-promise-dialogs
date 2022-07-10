import { expect, SuiteAPI, SuiteHooks, TestAPI, vitest } from 'vitest';
import { closeAllDialogs, createPromiseDialog, PromiseDialogsWrapper } from 'vue-promise-dialogs/src';
import { RegularComponent } from 'vue-promise-dialogs/src/types';

interface TestDialogWrapper {
    clickButton(selector: string): Promise<void>;

    exists(): boolean;
}

interface Wrapper {
    setUnmountDelay: (delay: number) => Promise<void>;
    destroy: () => void;
    findDialog: (selector: { name: string }, index?: number) => TestDialogWrapper;
}

type BeforeEach = (fn: SuiteHooks['beforeEach'][0]) => void;

interface Params {
    describe: SuiteAPI;
    it: TestAPI;
    beforeEach: BeforeEach;
    TestDialog: RegularComponent;
    TestDialogWithDelays: RegularComponent;

    mountWrapper(promiseDialogsWrapper: typeof PromiseDialogsWrapper): Wrapper;

    nextTick(): Promise<void>;
}

export function testVuePromiseDialogs(
    {
        describe,
        it,
        beforeEach,
        TestDialog,
        TestDialogWithDelays,
        mountWrapper,
        nextTick,
    }: Params,
) {
    const testDialogFunction = createPromiseDialog<{ text: string }, boolean>(TestDialog);

    describe('when PromiseDialogsWrapper mounted', () => {
        let wrapper: Wrapper;

        beforeEach(() => {
            wrapper = mountWrapper(PromiseDialogsWrapper);

            return () => {
                wrapper.destroy();
            };
        });

        describe('when dialog function called', () => {
            let resultPromise: Promise<unknown>;
            let dialog: TestDialogWrapper;

            beforeEach(async () => {
                resultPromise = testDialogFunction({ text: 'Test' });

                await nextTick();

                dialog = wrapper.findDialog({ name: 'TestDialog' });

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
                    await dialog.clickButton('button[name="true"]');
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
                    await dialog.clickButton('button[name="cancel"]');
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
                let secondDialog: TestDialogWrapper;

                beforeEach(async () => {
                    secondResultPromise = testDialogFunction({ text: 'Test' });

                    await nextTick();

                    secondDialog = wrapper.findDialog({ name: 'TestDialog' }, 1);

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
                        await secondDialog.clickButton('button[name="true"]');
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
                        await secondDialog.clickButton('button[name="cancel"]');
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
            const testDialogFunctionWithDelay = createPromiseDialog<{ text: string }, boolean>(TestDialogWithDelays);

            let resultPromise: Promise<boolean>;
            let dialog: TestDialogWrapper;

            beforeEach(async () => {
                await wrapper.setUnmountDelay(300);

                resultPromise = testDialogFunctionWithDelay({ text: 'Test' });

                await nextTick();

                dialog = wrapper.findDialog({ name: 'TestDialogWithDelays' });

                return () => {
                    resultPromise.catch(() => {
                        // ignore
                    });
                };
            });

            describe('when variant with delay selected in dialog', () => {
                beforeEach(async () => {
                    vitest.useFakeTimers();

                    await dialog.clickButton('button[name="true"]');

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
                    await nextTick();

                    expect(dialog.exists()).toBe(false);
                });
            });

            describe('when variant without delay selected in dialog', () => {
                beforeEach(async () => {
                    vitest.useFakeTimers();

                    await dialog.clickButton('button[name="false"]');

                    return () => {
                        vitest.useRealTimers();
                    };
                });

                it('should resolve dialog function promise', async () => {
                    await expect(resultPromise).resolves.toBe(false);
                });

                it('should unmount dialog component after default dialog delay', async () => {
                    expect(dialog.exists()).toBe(true);

                    vitest.advanceTimersByTime(300);
                    await nextTick();

                    expect(dialog.exists()).toBe(false);
                });
            });

            describe('when cancel variant selected in dialog', () => {
                beforeEach(async () => {
                    vitest.useFakeTimers();

                    await dialog.clickButton('button[name="cancel"]');

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
                    await nextTick();

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

            let anotherWrapper: Wrapper;

            beforeEach(() => {
                const originalConsoleError = console.error;
                console.error = mockedConsoleError;

                anotherWrapper = mountWrapper(PromiseDialogsWrapper);

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
}
