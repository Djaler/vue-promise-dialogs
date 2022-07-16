<template>
    <dialog open>
        <article>
            <header>{{ params.text }}</header>

            <div class="grid">
                <button @click="close">Ok</button>
            </div>

            <footer>
                <small>
                    <a href="https://github.com/Djaler/vue-promise-dialogs/blob/master/packages/demo/src/notify-dialog/NotifyDialog.vue"
                       class="secondary"
                       target="_blank"
                    >
                        Source code
                    </a>
                </small>
            </footer>
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
