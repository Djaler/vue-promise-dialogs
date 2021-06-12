import Vue from 'vue';

export default abstract class BasePromiseDialog<P, R> extends Vue {
    params: P;
    resolve(value: R, unmountDelay?: number): void;
    reject(error: unknown, unmountDelay?: number): void;
}
