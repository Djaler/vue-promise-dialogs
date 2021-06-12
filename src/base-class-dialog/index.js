import Vue from 'vue';

export default Vue.extend({
    props: ['params'],
    methods: {
        resolve(value, unmountDelay) {
            this.$emit('resolve', value, unmountDelay);
        },
        reject(error, unmountDelay) {
            this.$emit('reject', error, unmountDelay);
        },
    },
});
