import { defineComponent, h, isVue3, onBeforeUnmount } from 'vue-demi';

import { dialogsData, rejectDialog, resolveDialog, wrapperExists } from './store';

export default defineComponent({
    name: 'PromiseDialogsWrapper',
    props: {
        unmountDelay: {
            type: Number,
            default: 0,
        },
    },
    setup(props) {
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
                const component = value.component;
                const params = value.params;

                const resolve = (result: unknown, unmountDelay?: number) => resolveDialog(
                    id,
                    result,
                    unmountDelay || value.unmountDelay || props.unmountDelay,
                );

                const reject = (error: unknown, unmountDelay?: number) => rejectDialog(
                    id,
                    error,
                    unmountDelay || value.unmountDelay || props.unmountDelay,
                );

                if (isVue3) {
                    return h(component as any, {
                        key: id,
                        params,
                        onResolve: resolve,
                        onReject: reject,
                    });
                }

                return h(component as any, {
                    key: id as any,
                    props: {
                        params,
                    },
                    on: {
                        resolve,
                        reject,
                    },
                });
            }),
        );
    },
});
