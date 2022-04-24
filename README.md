[![npm](https://img.shields.io/npm/v/vue-promise-dialogs?style=for-the-badge)](https://www.npmjs.com/package/vue-promise-dialogs)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-promise-dialogs?style=for-the-badge)](https://bundlephobia.com/result?p=vue-promise-dialogs)
[![Mutation testing badge](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2FDjaler%2Fvue-promise-dialogs%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/Djaler/vue-promise-dialogs/master)

# Vue Promise Dialogs

> A tiny & modern library that allows you to work with dialogs as with asynchronous functions. [See demo](https://codepen.io/djaler/pen/xxEMZNr?editors=1010)

## Why?

Because many dialogs work exactly as promises. 
They are opened (called) and then closed with some result (resolved) or canceled (rejected).

## Install

```sh
npm install --save vue-promise-dialogs
```

Or for a CDN version, you can use it on [unpkg.com](https://unpkg.com/vue-promise-dialogs)

## Usage

Main requirements:

1. You should mount exactly one `PromiseDialogsWrapper` somewhere in your application root.
2. The dialog component should accept `params` props.
3. The dialog component should emit `resolve` or `reject` events when the user makes a decision.

```ts
import { createPromiseDialog } from "vue-promise-dialogs"

const BooleanDialog = Vue.extend({
    template: `
      <div class="dialog">
          <p>{{ params.text }}</p>
          <button name="true" @click="$emit('resolve', true)">True</button>
          <button name="false" @click="$emit('resolve', false)">False</button>
          <button name="cancel" @click="$emit('reject', 'cancel')">Cancel</button>
      </div>
    `,
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
});

// First type argument is the type of params prop that will be passed to component
// Second type argument is the type of value with which the promise will be fulfilled
const openDialog = createPromiseDialog<{ text: string }, boolean>(BooleanDialog);

// When you call this function, dialog will be mounted to `PromiseDialogsWrapper`.
// When user press any button and resolve/reject event emitted, promise will be settled and dialog will be destroyed.
const result: boolean = await openDialog({ text: 'Some text' });
```

### Unmount delay

By default, a dialog is unmounted immediately right after resolve/reject, but maybe you want to change this behaviour, for example, to play the close animation. 

You have two options here:

1. Specify the unmount delay (in ms) using `unmountDelay` prop in `PromiseDialogsWrapper`.
2. Specify the unmount delay (in ms) as a second argument when emitting `resolve`/`reject` event. This option will override `unmountDelay` prop if both are provided.

### Close all

In some cases you may want to close all opened dialogs. For example, on route change.

You can use `closeAllDialogs` for this. All you need is to set a reason, which will be used in promises reject. 

### Vue Class Component Example

If you're using Vue Class Component to define your dialog components, you can extend them from `BasePromiseDialog`.
This will allow you to avoid defining type arguments in `createPromiseDialog`.
`BasePromiseDialog` already defines `params` prop and methods `resolve`/`reject`, so you don't have to.

```ts
import { Component } from "vue-class-component"
import { BasePromiseDialog, createPromiseDialog } from "vue-promise-dialogs"

@Component({
    template: `
      <div class="dialog">
          <p>{{ params.text }}</p>
          <button name="true" @click="onTrue">True</button>
          <button name="false" @click="onFalse">False</button>
          <button name="cancel" @click="onCancel">Cancel</button>
      </div>
    `,
})
// You need to extend your component from BasePromiseDialog with correct type arguments
class BooleanDialog extends BasePromiseDialog<{ text: string }, boolean> {
    onTrue() {
        this.resolve(true);
    }

    onFalse() {
        this.resolve(true);
    }

    onCancel() {
        this.reject('cancel');
    }
}

// You don't have to specify type arguments because they are inferenced from BooleanDialog
const openDialog = createPromiseDialog(BooleanDialog);

const result: boolean = await openDialog({ text: 'Some text' });
```

## TODO
- [ ] Vue 3 support
- [ ] Fallback to mount dialogs without PromiseDialogsWrapper
