import { del, markRaw, Ref, ref, set } from 'vue-demi';

import { RegularComponent } from '../types';

export const wrapperExists = ref(false);

interface DialogData<P, R> {
    component: RegularComponent;
    params: P;
    promiseResolve: (value: R) => void;
    promiseReject: (error: unknown) => void;
    unmountDelay?: number;
}

export const dialogsData: Ref<Record<symbol, DialogData<any, any>>> = ref({});

export function add<P, R>(component: RegularComponent, params: P, unmountDelay?: number): Promise<R> {
    return new Promise<R>((resolve, reject) => {
        // eslint-disable-next-line symbol-description
        set(dialogsData.value, Symbol(), {
            component: markRaw(component),
            params,
            promiseResolve: resolve,
            promiseReject: reject,
            unmountDelay,
        });
    });
}

export function resolveDialog(id: symbol, result: unknown, unmountDelay?: number) {
    dialogsData.value[id].promiseResolve(result);
    unmountDialog(id, unmountDelay);
}

export function rejectDialog(id: symbol, error: unknown, unmountDelay?: number) {
    dialogsData.value[id].promiseReject(error);
    unmountDialog(id, unmountDelay);
}

function unmountDialog(id: symbol, delay?: number) {
    const unmount = () => del(dialogsData.value, id);
    if (delay) {
        setTimeout(unmount, delay);
    } else {
        unmount();
    }
}
