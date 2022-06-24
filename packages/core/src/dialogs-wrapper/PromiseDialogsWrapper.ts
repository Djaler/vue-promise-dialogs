import Vue, { VNode } from 'vue';

import { RegularComponent } from '../types';
import { promiseDialogsWrapper } from './store';

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
            dialogsData: {} as Record<symbol, DialogData<any, any>>,
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
                // eslint-disable-next-line symbol-description
                this.$set(this.dialogsData, Symbol() as any /* symbol really can be used as a key */, {
                    component,
                    params,
                    promiseResolve: resolve,
                    promiseReject: reject,
                    unmountDelay,
                });
            });
        },
        resolve(id: symbol, result: unknown, unmountDelay?: number) {
            this.dialogsData[id].promiseResolve(result);
            this.unmountDialog(id, unmountDelay);
        },
        reject(id: symbol, error: unknown, unmountDelay?: number) {
            this.dialogsData[id].promiseReject(error);
            this.unmountDialog(id, unmountDelay);
        },
        unmountDialog(id: symbol, delay?: number) {
            const unmount = () => this.$delete(this.dialogsData, id as any);
            if (delay) {
                setTimeout(unmount, delay);
            } else {
                unmount();
            }
        },
    },
    render(createElement): VNode {
        return createElement(
            'div',
            Object.getOwnPropertySymbols(this.dialogsData).map((id) => {
                const value = this.dialogsData[id];
                return createElement(value.component, {
                    key: id as any,
                    props: {
                        params: value.params,
                    },
                    on: {
                        resolve: (result: unknown, unmountDelay?: number) => {
                            this.resolve(id, result, unmountDelay || value.unmountDelay || this.unmountDelay);
                        },
                        reject: (error: unknown, unmountDelay?: number) => {
                            this.reject(id, error, unmountDelay || value.unmountDelay || this.unmountDelay);
                        },
                    },
                });
            }),
        );
    },
});
