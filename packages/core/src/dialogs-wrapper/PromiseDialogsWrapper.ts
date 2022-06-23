import { h, onBeforeUnmount } from 'vue-demi';

import { dialogsData, rejectDialog, resolveDialog, wrapperExists } from './store';

export default {
    name: 'PromiseDialogsWrapper',
    props: {
        unmountDelay: {
            type: Number,
            default: 0,
        },
    },
    setup(props: { unmountDelay: number }) {
        if (wrapperExists.value) {
            console.error('PromiseDialogsWrapper instance already exists');
        }

        wrapperExists.value = true;

        onBeforeUnmount(() => {
            wrapperExists.value = false;

            dialogsData.value = {};
        });

        return () => h(
            'div',
            Object.getOwnPropertySymbols(dialogsData.value).map((id) => {
                const value = dialogsData.value[id];

                return h(value.component, {
                    key: id as any,
                    props: {
                        params: value.params,
                    },
                    on: {
                        resolve: (result: unknown, unmountDelay?: number) => resolveDialog(
                            id, result, unmountDelay || value.unmountDelay || props.unmountDelay,
                        ),
                        reject: (error: unknown, unmountDelay?: number) => rejectDialog(
                            id, error, unmountDelay || value.unmountDelay || props.unmountDelay,
                        ),
                    },
                });
            }),
        );
    },
};
