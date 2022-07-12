<template>
    <dialog open>
        <article>
            <header>{{ params.text }}</header>

            <div class="grid">
                <button @click="confirm">{{ params.confirmButtonText || 'Yes' }}</button>
                <button @click="decline">{{ params.declineButtonText || 'No' }}</button>
            </div>
        </article>
    </dialog>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { ConfirmDialogParams } from './types';

    export default defineComponent({
        name: 'ConfirmDialog',
        props: {
            params: {
                type: Object as PropType<ConfirmDialogParams>,
                required: true,
            },
        },
        methods: {
            confirm() {
                this.$emit('resolve', true);
            },
            decline() {
                this.$emit('resolve', false);
            },
        },
    });
</script>
