<template>
    <main class="container">
        <button @click="ask">Push me</button>
    </main>
    <PromiseDialogsWrapper/>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { openConfirmDialog } from './confirm-dialog';
    import { PromiseDialogsWrapper } from 'vue-promise-dialogs/src';
    import { openNotifyDialog } from './notify-dialog';

    export default defineComponent({
        name: 'App',
        components: { PromiseDialogsWrapper },
        methods: {
            async ask() {
                const userLikesLibrary = await openConfirmDialog({
                    text: "Do you like vue-promise-dialogs?"
                });

                if (!userLikesLibrary) {
                    await openNotifyDialog({
                        text: "That's sad. Feel free to create issue on github"
                    });
                    return;
                }

                const userWantsToPutStar = await openConfirmDialog({
                    text: "Can I ask you to star this project on github?",
                    confirmButtonText: "Sure",
                    declineButtonText: "Nope"
                });

                if (userWantsToPutStar) {
                    window.open("https://github.com/Djaler/vue-promise-dialogs");
                }
            },
        },
    });
</script>

<style scoped>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 100vh;
    }
</style>
