import { promiseDialogsWrapper } from './dialogs-wrapper/store';
import { RegularComponent } from './types';

export function createPromiseDialog<P, R>(
    component: RegularComponent,
    unmountDelay?: number,
): (params: P) => Promise<R> {
    return function dialogFunction(params: P): Promise<R> {
        if (!promiseDialogsWrapper.value) {
            throw new Error('PromiseDialogsWrapper instance not found');
        }

        return promiseDialogsWrapper.value.add<P, R>(
            component,
            params,
            unmountDelay,
        );
    };
}
