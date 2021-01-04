import Vue from 'vue';

export default Vue.extend({
    props: ['params'],
    methods: {
        resolve(value) {
            this.$emit('resolve', value);
        },
        reject(error) {
            this.$emit('reject', error);
        },
    },
});
