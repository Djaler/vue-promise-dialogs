import { createPromiseDialog } from 'vue-promise-dialogs/src';

import ConfirmDialog from './ConfirmDialog.vue';
import { ConfirmDialogParams } from './types';

export const openConfirmDialog = createPromiseDialog<ConfirmDialogParams, boolean>(ConfirmDialog);
