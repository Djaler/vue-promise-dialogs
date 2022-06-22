import { Component, ComponentOptions } from 'vue';
import { EsModuleComponent } from 'vue/types/options';

import BasePromiseDialog from './base-class-dialog';

type Values<T> = T extends Record<any, infer U> ? U : never;

export type RegularComponent = Values<ComponentOptions<any>['components']>;

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
