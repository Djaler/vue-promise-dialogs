import { createPromiseDialog } from 'vue-promise-dialogs';

import NotifyDialog from './NotifyDialog.vue';
import { NotifyDialogParams } from './types';

export const openNotifyDialog = createPromiseDialog<NotifyDialogParams, void>(NotifyDialog);
