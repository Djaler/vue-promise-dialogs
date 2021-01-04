import Vue from 'vue';

export default abstract class BasePromiseDialog<P, R> extends Vue {
    params: P;
    resolve(value: R): void;
    reject(error: unknown): void;
}
