import { ComponentOptions } from 'vue';

type Values<T> = T extends Record<any, infer U> ? U : never;

export type Component = Values<ComponentOptions<any>['components']>;
