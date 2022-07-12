<template>
    <dialog open>
        <article>
            <header>{{ params.text }}</header>

            <div class="grid">
                <button @click="close">Ok</button>
            </div>
        </article>
    </dialog>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { NotifyDialogParams } from './types';

    export default defineComponent({
        name: 'ConfirmDialog',
        props: {
            params: {
                type: Object as PropType<NotifyDialogParams>,
                required: true,
            },
        },
        methods: {
            close() {
                this.$emit('resolve');
            },
        },
    });
</script>
