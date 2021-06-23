import { promiseDialogsWrapper } from '@/dialogs-wrapper/store';

export function closeAllDialogs(reason: unknown, unmountDelay?: number) {
    if (!promiseDialogsWrapper.value) {
        throw new Error('PromiseDialogsWrapper instance not found');
    }
    promiseDialogsWrapper.value.closeAll(reason, unmountDelay);
}
