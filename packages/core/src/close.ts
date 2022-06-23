import { dialogsData, rejectDialog } from './dialogs-wrapper/store';

export function closeAllDialogs(reason: unknown, unmountDelay?: number) {
    Object.getOwnPropertySymbols(dialogsData.value).forEach(id => rejectDialog(id, reason, unmountDelay));
}
