import Vue, { VNode } from 'vue';

import { promiseDialogsWrapper } from '@/dialogs-wrapper/store';
import { RegularComponent } from '@/types';

interface DialogData<P, R> {
    component: RegularComponent;
    params: P;
    promiseResolve: (value: R) => void;
    promiseReject: (error: unknown) => void;
}

export default Vue.extend({
    name: 'PromiseDialogsWrapper',
    data() {
        return {
            dialogsData: new Map<symbol, DialogData<any, any>>(),
        };
    },
    created() {
        if (promiseDialogsWrapper.value) {
            console.error('PromiseDialogsWrapper instance already exists');
            return;
        }

        promiseDialogsWrapper.value = this;
    },
    beforeDestroy() {
        promiseDialogsWrapper.value = undefined;
    },
    methods: {
        add<P, R>(component: RegularComponent, params: P): Promise<R> {
            return new Promise<R>((resolve, reject) => {
                this.dialogsData = new Map([
                    ...this.dialogsData,
                    [
                        // eslint-disable-next-line symbol-description
                        Symbol(),
                        {
                            component,
                            params,
                            promiseResolve: resolve,
                            promiseReject: reject,
                        },
                    ],
                ]);
            });
        },
        onResolve(id: symbol, result: unknown) {
            this.dialogsData.get(id)?.promiseResolve(result);
            this.dialogsData = new Map(
                [...this.dialogsData].filter(([key]) => key !== id),
            );
        },
        onReject(id: symbol, error: unknown) {
            this.dialogsData.get(id)?.promiseReject(error);
            this.dialogsData = new Map(
                [...this.dialogsData].filter(([key]) => key !== id),
            );
        },
    },
    render(createElement): VNode {
        return createElement(
            'div',
            [...this.dialogsData].map(
                ([id, value]) => createElement(value.component, {
                    key: id as any,
                    props: {
                        params: value.params,
                    },
                    on: {
                        resolve: (result: unknown) => {
                            this.onResolve(id, result);
                        },
                        reject: (error: unknown) => {
                            this.onReject(id, error);
                        },
                    },
                }),
            ),
        );
    },
});
