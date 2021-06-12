import { promiseDialogsWrapper } from '@/dialogs-wrapper/store';
import { BasePromiseDialogComponent, RegularComponent } from '@/types';

export function createPromiseDialog<P, R>(
    component: BasePromiseDialogComponent<P, R>,
    unmountDelay?: number,
): (params: P) => Promise<R>;
export function createPromiseDialog<P, R>(
    component: RegularComponent,
    unmountDelay?: number,
): (params: P) => Promise<R>;
export function createPromiseDialog<P, R>(component: RegularComponent, unmountDelay?: number) {
    return function dialogFunction(params: P): Promise<R> {
        if (!promiseDialogsWrapper.value) {
            throw new Error('PromiseDialogsWrapper instance not found');
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return promiseDialogsWrapper.value.add<P, R>(
            component,
            params,
            unmountDelay,
        );
    };
}
