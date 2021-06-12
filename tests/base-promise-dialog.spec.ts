import { shallowMount, Wrapper } from '@vue/test-utils';
import { Component } from 'vue-property-decorator';

import { BasePromiseDialog } from '@/index';

@Component({
    template: `
      <div/>
    `,
})
class TestDialog extends BasePromiseDialog<{ text: string }, boolean> {

}

let wrapper: Wrapper<TestDialog>;

beforeEach(() => {
    wrapper = shallowMount(TestDialog, {
        propsData: {
            params: { text: 'text' },
        },
    });
});

it('should accept params prop', () => {
    expect(wrapper.props()).toEqual({ params: { text: 'text' } });
});

describe('resolve', () => {
    beforeEach(() => {
        wrapper.vm.resolve(true);
    });

    it('should emit resolve event', () => {
        expect(wrapper.emitted('resolve')).toEqual([[true]]);
    });
});

describe('reject', () => {
    const error = new Error();

    beforeEach(() => {
        wrapper.vm.reject(error);
    });

    it('should emit reject event', () => {
        expect(wrapper.emitted('reject')).toEqual([[error]]);
    });
});
