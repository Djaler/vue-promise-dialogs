import Vue, { VNode } from 'vue';

import { promiseDialogsWrapper } from '@/dialogs-wrapper/store';
import { RegularComponent } from '@/types';

interface DialogData<P, R> {
    component: RegularComponent;
    params: P;
    promiseResolve: (value: R) => void;
    promiseReject: (error: unknown) => void;
    unmountDelay?: number;
}

export default Vue.extend({
    name: 'PromiseDialogsWrapper',
    props: {
        unmountDelay: {
            type: Number,
            default: 0,
        },
    },
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
        add<P, R>(component: RegularComponent, params: P, unmountDelay?: number): Promise<R> {
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
                            unmountDelay,
                        },
                    ],
                ]);
            });
        },
        onResolve(id: symbol, result: unknown, unmountDelay?: number) {
            this.dialogsData.get(id)?.promiseResolve(result);
            this.unmountDialog(id, unmountDelay);
        },
        onReject(id: symbol, error: unknown, unmountDelay?: number) {
            this.dialogsData.get(id)?.promiseReject(error);
            this.unmountDialog(id, unmountDelay);
        },
        unmountDialog(id: symbol, delay?: number) {
            const unmount = () => {
                this.dialogsData = new Map(
                    [...this.dialogsData].filter(([key]) => key !== id),
                );
            };
            if (delay) {
                setTimeout(unmount, delay);
            } else if (this.unmountDelay) {
                setTimeout(unmount, this.unmountDelay);
            } else {
                unmount();
            }
        },
        closeAll(reason: unknown, delay?: number) {
            [...this.dialogsData].forEach(([id]) => {
                this.onReject(id, reason, delay);
            });
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
                        resolve: (result: unknown, unmountDelay?: number) => {
                            this.onResolve(id, result, unmountDelay || value.unmountDelay);
                        },
                        reject: (error: unknown, unmountDelay?: number) => {
                            this.onReject(id, error, unmountDelay || value.unmountDelay);
                        },
                    },
                }),
            ),
        );
    },
});
