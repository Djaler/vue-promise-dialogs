import { promiseDialogsWrapper } from '@/dialogs-wrapper/store';

export function closeAllDialogs(reason: unknown, unmountDelay?: number) {
    const wrapper = promiseDialogsWrapper.value;
    if (!wrapper) {
        throw new Error('PromiseDialogsWrapper instance not found');
    }
    Object.getOwnPropertySymbols(wrapper.dialogsData).forEach(id => wrapper.reject(id, reason, unmountDelay));
}
