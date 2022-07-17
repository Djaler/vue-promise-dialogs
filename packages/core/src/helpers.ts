import { getCurrentInstance } from 'vue';

export function usePromiseDialogControls<T = void>(
    options?: {
        unmountDelay?: number;
    },
) {
    const vm = getCurrentInstance();
    // @ts-expect-error mis-alignment with @vue/composition-api
    const emit = vm?.emit || vm?.$emit?.bind(vm) || vm?.proxy?.$emit?.bind(vm?.proxy);

    return {
        resolve(value: T) {
            emit('resolve', value, options?.unmountDelay);
        },
        reject(value: unknown) {
            emit('reject', value, options?.unmountDelay);
        },
    };
}
