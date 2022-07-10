import { mount } from '@vue/test-utils';
import { testVuePromiseDialogs } from 'tests-base';
import { beforeEach, describe, it } from 'vitest';
import Vue from 'vue';
import { compileToFunctions } from 'vue-template-compiler';

testVuePromiseDialogs({
    describe,
    it,
    beforeEach,
    TestDialog: Vue.extend({
        name: 'TestDialog',
        ...compileToFunctions(`
          <div>
              <p>{{ params.text }}</p>
              <button name="true" @click="$emit('resolve', true)">True</button>
              <button name="false" @click="$emit('resolve', false)">False</button>
              <button name="cancel" @click="$emit('reject', 'cancel')">Cancel</button>
          </div>
        `),
        props: {
            params: {
                type: Object,
                required: true,
            },
        },
    }),
    TestDialogWithDelays: Vue.extend({
        name: 'TestDialogWithDelays',
        ...compileToFunctions(`
          <div>
              <p>{{ params.text }}</p>
              <button name="true" @click="$emit('resolve', true, 100)">True</button>
              <button name="false" @click="$emit('resolve', false)">False</button>
              <button name="cancel" @click="$emit('reject', 'cancel', 200)">Cancel</button>
          </div>
        `),
        props: {
            params: {
                type: Object,
                required: true,
            },
        },
    }),
    mountWrapper(PromiseDialogsWrapper) {
        const wrapper = mount(PromiseDialogsWrapper);

        return {
            async setUnmountDelay(delay) {
                await wrapper.setProps({ unmountDelay: delay });
            },
            destroy() {
                wrapper.destroy();
            },
            findDialog(dialogSelector, index = 0) {
                const dialog = wrapper.findAllComponents(dialogSelector).at(index);

                return {
                    async clickButton(buttonSelector) {
                        await dialog.find(buttonSelector).trigger('click');
                    },
                    exists() {
                        return dialog.exists();
                    },
                };
            },
        };
    },
    async nextTick() {
        await Vue.nextTick();
    },
});
