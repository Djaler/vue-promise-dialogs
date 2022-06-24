import { RegularComponent } from '../types';

interface OptionalValueWrapper<T> {
    value?: T;
}

interface PromiseDialogsWrapper {
    dialogsData: Record<symbol, unknown>;

    add<P, R>(component: RegularComponent, params: P, unmountDelay?: number): Promise<R>;

    reject(id: symbol, error: unknown, unmountDelay?: number): void;
}

export const promiseDialogsWrapper: OptionalValueWrapper<PromiseDialogsWrapper> = {};
