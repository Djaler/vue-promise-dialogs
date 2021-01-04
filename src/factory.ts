import { promiseDialogsWrapper } from '@/dialogs-wrapper/store';
import { BasePromiseDialogComponent, RegularComponent } from '@/types';

export function createPromiseDialog<P, R>(component: BasePromiseDialogComponent<P, R>): (params: P) => Promise<R>;
export function createPromiseDialog<P, R>(component: RegularComponent): (params: P) => Promise<R>;
export function createPromiseDialog<P, R>(component: RegularComponent) {
    return function dialogFunction(params: P): Promise<R> {
        if (!promiseDialogsWrapper.value) {
            throw new Error('PromiseDialogsWrapper instance not found');
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return promiseDialogsWrapper.value.add<P, R>(
            component,
            params,
        );
    };
}
