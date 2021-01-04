import { AsyncComponent, Component } from 'vue';
import { EsModuleComponent } from 'vue/types/options';

import BasePromiseDialog from '@/base-class-dialog';

export type RegularComponent = Component<any, any, any, any> | AsyncComponent<any, any, any, any>;

interface ClassConstructor<T> {
    new(...args: any[]): T;
}

interface EsModule<T> {
    default: T;
}

type SimpleBasePromiseDialogComponent<P, R> = Component & ClassConstructor<BasePromiseDialog<P, R>>;

type AsyncBasePromiseDialogComponentPromise<P, R> = (
    resolve: (component: Component<any, any, any, any>) => void,
    reject: (reason?: any) => void,
) => Promise<SimpleBasePromiseDialogComponent<P, R> | EsModule<SimpleBasePromiseDialogComponent<P, R>>> | void;

type AsyncBasePromiseDialogComponentFactory<P, R> = () => {
    component: AsyncBasePromiseDialogComponentPromise<P, R>;
    loading?: Component | EsModuleComponent;
    error?: Component | EsModuleComponent;
    delay?: number;
    timeout?: number;
};

type AsyncBasePromiseDialogComponent<P, R> =
    AsyncBasePromiseDialogComponentPromise<P, R>
    | AsyncBasePromiseDialogComponentFactory<P, R>;

export type BasePromiseDialogComponent<P, R> =
    SimpleBasePromiseDialogComponent<P, R>
    | AsyncBasePromiseDialogComponent<P, R>;
