import { createPromiseDialog } from 'vue-promise-dialogs/src';

import NotifyDialog from './NotifyDialog.vue';
import { NotifyDialogParams } from './types';

export const openNotifyDialog = createPromiseDialog<NotifyDialogParams, void>(NotifyDialog);
