import { add, wrapperExists } from './dialogs-wrapper/store';
import { RegularComponent } from './types';

export function createPromiseDialog<P, R>(
    component: RegularComponent,
    unmountDelay?: number,
): (params: P) => Promise<R> {
    return function dialogFunction(params: P): Promise<R> {
        if (!wrapperExists.value) {
            throw new Error('PromiseDialogsWrapper instance not found');
        }

        return add<P, R>(
            component,
            params,
            unmountDelay,
        );
    };
}
