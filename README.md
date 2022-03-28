# FSFormGroup

The FSFormGroup library makes it easy to create DOM Elements with linked methods to update and save states to a JSON file instance.

**Intended use**

Using [Electron](https://www.electronjs.org/) to create desktop applications is simple, however saving app preferences must be done outside the sandboxed app session - which is why FSFormGroup uses the Node.js File System module to read/write/parse JavaScript objects and save them to a JSON file, which can be read back on next app launch.

## **Installation**

```sh
npm install fs-form-group --save-dev
```

**Import and define module**

```js
const FSFormGroup = require('fs-form-group');
```

## **Constructor**

### Syntax

```js
new FSFormGroup(path);
new FSFormGroup(path, options);
new FSFormGroup(path, options, css);
```

### Parameters

`path`

-   | Type     | Required | Description                            |
    | -------- | -------- | -------------------------------------- |
    | `string` | &#10004; | Valid file path to store instance data |

`options`

-   | Type     | Required | Description                                  |
    | -------- | -------- | -------------------------------------------- |
    | `object` |          | Options for JSON stringification and parsing |

-   | Property   | Required | Type     | Default  | Description                                       |
    | ---------- | -------- | -------- | -------- | ------------------------------------------------- |
    | `encoding` |          | `string` | `'utf8'` | Use as data encoding type                         |
    | `space`    |          | `number` | `0`      | Passed to `JSON.stringify()` as `space` parameter |

`css`

-   | Type     | Required | Description                                                 |
    | -------- | -------- | ----------------------------------------------------------- |
    | `object` |          | Space-separated list of classes to attach to created groups |

-   | Property               | Required | Type     | Default | Description                                                   |
    | ---------------------- | -------- | -------- | ------- | ------------------------------------------------------------- |
    | `formGroup`            |          | `string` | `''`    | Add to group wrapper element class `<div>`                    |
    | `formGroupHeading`     |          | `string` | `''`    | Add to heading element class `<h3>`                           |
    | `formGroupDescription` |          | `string` | `''`    | Add to description element class `<p>`                        |
    | `formGroupComponent`   |          | `string` | `''`    | Add to input component wrapper element class `<div>`          |
    | `formGroupInput`       |          | `string` | `''`    | Add to all input elements class (including buttons) `<input>` |

### Examples

Create a new file instance using default options

```js
const form = new FSFormGroup('./path/to/file.json');
```

Create a new file instance which will attach defined classes to each created input group.

```js
const form = new FSFormGroup('./path/to/file.json', null, {
    formGroup: 'fg-dark-theme',
    formGroupInput: 'fg-dark-theme-input',
});

// Result from FSFormGroup.inputGroup(...):
//
// <div class="fg-dark-theme">
//     <h3>Heading</h3>
//     <p>Description</p>
//     <div>
//         <input type="text" class="fg-dark-theme-input" value="inputGroup" />
//     </div>
// </div>
```

## **Private Properties**

`_components`

-   | Type     | Default | Description                                                                                                             |
    | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
    | `object` | `{}`    | Holds all created component instances. **Do not read**. States should be read using [`FSFormGroup.getData()`](#getdata) |

`_groupKey`

-   | Type     | Default | Description                                                                                                                                                                          |
    | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | `number` | `0`     | Counter variable staring from `0` of created component instances with an undefined `groupKey` value. Used to create default instance `groupKey` by: group`_groupKey`; e.g. `group0`. |

## **Methods**

---

### **`getData()`**

### Syntax

```js
FSFormGroup.getData();
FSFormGroup.getData(groupKey);
```

### Parameters

`groupKey`

-   | Type     | Description                                     |
    | -------- | ----------------------------------------------- |
    | `string` | The existing identifier of the object to return |

### Returns

-   If `groupKey` is omitted, an object is returned with all groups. `{ groupKeys[] }`.
-   If `groupKey` is defined and exists, the `groupKey[]` array is returned; otherwise returns `undefined`.

### Examples

Collect latest file state and loop through all groups and states.

```js
// Collect latest file state as JavaScript object
const data = form.getData();

console.log(data);
// -> {
//        group0: [
//            { value: 'inputs group0 state 1' },
//            { value: 'inputs group0 state 2' },
//        ],
//        group1: [
//            { value: 'inputs group1 state 3' },
//            { value: 'inputs group1 state 4' },
//        ],
//    }

// Loop through form groups
for (const group in data) {
    console.log(group);

    // Loop through group states
    for (const state of data[group]) {
        console.log(state);
    }
}

// Console:
// -> group0
//   -> { value: 'inputs group0 state 1' }
//   -> { value: 'inputs group0 state 2' }
// -> group1
//   -> { value: 'inputs group1 state 3' }
//   -> { value: 'inputs group1 state 4' }
```

Collect latest file group state and loop through all states.

```js
// Collect latest file state as JavaScript object
const data = form.getData('group1');

console.log(data);
// -> {
//        group1: [
//            { value: 'inputs group1 state 3' },
//            { value: 'inputs group1 state 4' },
//        ],
//    }

// Loop through form groups
for (const group in data) {
    console.log(group);

    // Loop through group states
    for (const state of data[group]) {
        console.log(state);
    }
}

// Console:
// -> group1
//   -> { value: 'inputs group1 state 3' }
//   -> { value: 'inputs group1 state 4' }
```

---

### **`inputGroup()`**

### Syntax

```js
FSFormGroup.inputGroup(options);
```

### Parameters

`options`

-   | Type     | Required | Description                          |
    | -------- | -------- | ------------------------------------ |
    | `object` | &#10004; | Object containing component options. |

-   | Property           | Required | Type                                                 | Default          | Description                                                                                                                                                                                                                   |
    | ------------------ | -------- | ---------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `componentClass`   |          | `string`                                             |                  | Space-separated class list to attach to component wrapper element `<div>`                                                                                                                                                     |
    | `description`      |          | `string`                                             |                  | Text content to display in component description element `<p>`                                                                                                                                                                |
    | `descriptionClass` |          | `string`                                             |                  | Space-separated class list to attach to description element `<p>`                                                                                                                                                             |
    | `events`           |          | `array` or<br>`object`                               |                  | Key, value pairs where: `key` defines a valid `HTMLElement` or `HTMLInputElement` [`Event`](https://developer.mozilla.org/en-US/docs/Web/Events); and `value` defines a `callbackFn`. See [events](#events).                  |
    | `groupClass`       |          | `string`                                             |                  | Space-separated class list to attach to group wrapper element `<div>`                                                                                                                                                         |
    | `groupKey`         |          | `string`                                             | group`_groupKey` | Use as group key (identifier).                                                                                                                                                                                                |
    | `heading`          |          | `string`                                             |                  | Text content to display in component description element `<h3>`                                                                                                                                                               |
    | `headingClass`     |          | `string`                                             |                  | Space-separated class list to attach to heading element `<h3>`                                                                                                                                                                |
    | `props`            |          | `array` or<br>`object`                               |                  | Immutable attributes to set on `HTMLInputElement`. Defined by key, value pairs. Underscore keys will be accessible through instance but not set to element. See [props](#props).                                              |
    | `state`            | &#10004; | `array` or<br>`object` or<br>`string` or<br>`number` |                  | Mutable key, value pairs for `HTMLInputElement` which are parsed and written to JSON file. A passed `object` must have a minimum `value` key with a set value pair.<br>e.g. `{ value: 'hello world!' }`. See [state](#state). |

### Returns

-   Input group component wrapped in a `HTMLDivElement`.

---

### **`inputsGroup()`**

### Syntax

```js
FSFormGroup.inputsGroup(options);
```

### Parameters

`options`

-   | Type    | Required | Description                                        |
    | ------- | -------- | -------------------------------------------------- |
    | `array` | &#10004; | Array of objects containing _n_ component options. |

-   | Property           | Required | Type                                                 | Default          | Description                                                                                                                                                                                                                   |
    | ------------------ | -------- | ---------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `componentClass`   |          | `string`                                             |                  | Space-separated class list to attach to component wrapper element `<div>`                                                                                                                                                     |
    | `description`      |          | `string`                                             |                  | Text content to display in component description element `<p>`                                                                                                                                                                |
    | `descriptionClass` |          | `string`                                             |                  | Space-separated class list to attach to description element `<p>`                                                                                                                                                             |
    | `events`           |          | `array` or<br>`object`                               |                  | Key, value pairs where: `key` defines a valid `HTMLElement` or `HTMLInputElement` [`Event`](https://developer.mozilla.org/en-US/docs/Web/Events); and `value` defines a `callbackFn`. See [events](#events).                  |
    | `groupClass`       |          | `string`                                             |                  | Space-separated class list to attach to group wrapper element `<div>`                                                                                                                                                         |
    | `groupKey`         |          | `string`                                             | group`_groupKey` | Use as group key (identifier).                                                                                                                                                                                                |
    | `heading`          |          | `string`                                             |                  | Text content to display in component description element `<h3>`                                                                                                                                                               |
    | `headingClass`     |          | `string`                                             |                  | Space-separated class list to attach to heading element `<h3>`                                                                                                                                                                |
    | `props`            |          | `array` or<br>`object`                               |                  | Immutable attributes to set on `HTMLInputElement`. Defined by key, value pairs. Underscore keys will be accessible through instance but not set to element. See [props](#props).                                              |
    | `state`            | &#10004; | `array` or<br>`object` or<br>`string` or<br>`number` |                  | Mutable key, value pairs for `HTMLInputElement` which are parsed and written to JSON file. A passed `object` must have a minimum `value` key with a set value pair.<br>e.g. `{ value: 'hello world!' }`. See [state](#state). |

### Returns

-   Inputs group component wrapped in a `HTMLDivElement`.

---

### **`removableInputsGroup()`**

### Syntax

```js
FSFormGroup.removableInputsGroup(options);
```

### Parameters

`options`

-   | Type    | Required | Description                                        |
    | ------- | -------- | -------------------------------------------------- |
    | `array` | &#10004; | Array of objects containing _n_ component options. |

-   | Property           | Required | Type                                                 | Default                                                          | Description                                                                                                                                                                                                                   |
    | ------------------ | -------- | ---------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `addNewButton`     |          | `object`                                             | `addNewButton.value: 'Add New'`<br>`addNewButton.type: 'button'` | Props for the button that adds a new input component button                                                                                                                                                                   |
    | `componentClass`   |          | `string`                                             |                                                                  | Space-separated class list to attach to component wrapper element `<div>`                                                                                                                                                     |
    | `description`      |          | `string`                                             |                                                                  | Text content to display in component description element `<p>`                                                                                                                                                                |
    | `descriptionClass` |          | `string`                                             |                                                                  | Space-separated class list to attach to description element `<p>`                                                                                                                                                             |
    | `events`           |          | `array` or<br>`object`                               |                                                                  | Key, value pairs where: `key` defines a valid `HTMLElement` or `HTMLInputElement` [`Event`](https://developer.mozilla.org/en-US/docs/Web/Events); and `value` defines a `callbackFn`. See [events](#events).                  |
    | `groupClass`       |          | `string`                                             |                                                                  | Space-separated class list to attach to group wrapper element `<div>`                                                                                                                                                         |
    | `groupKey`         |          | `string`                                             | group`_groupKey`                                                 | Use as group key (identifier).                                                                                                                                                                                                |
    | `heading`          |          | `string`                                             |                                                                  | Text content to display in component description element `<h3>`                                                                                                                                                               |
    | `headingClass`     |          | `string`                                             |                                                                  | Space-separated class list to attach to heading element `<h3>`                                                                                                                                                                |
    | `max`              |          | `number`                                             | `10`                                                             | A number defining the maximum number of input components allowed                                                                                                                                                              |
    | `props`            |          | `array` or<br>`object`                               |                                                                  | Immutable attributes to set on `HTMLInputElement`. Defined by key, value pairs. Underscore keys will be accessible through instance but not set to element. See [props](#props).                                              |
    | `removeButton`     |          | `object`                                             | `removeButton.value: 'x'`<br>`removeButton.type: 'button'`       | Props for the button that removes an input component button                                                                                                                                                                   |
    | `state`            | &#10004; | `array` or<br>`object` or<br>`string` or<br>`number` |                                                                  | Mutable key, value pairs for `HTMLInputElement` which are parsed and written to JSON file. A passed `object` must have a minimum `value` key with a set value pair.<br>e.g. `{ value: 'hello world!' }`. See [state](#state). |

### Returns

-   Removable inputs group component wrapped in a `HTMLDivElement`.

## Reference

-   ### **events**

    -   **keys**
        -   [`...EventTypes`](https://developer.mozilla.org/en-US/docs/Web/Events)
            -   Popular: `input`, `change`, `keydown`, `keyup`, `focus`, `blur`
    -   **values**

        -   `callbackFn`

        ```js
        // Callback function
        function eventHandler(event, instance) {
            // instance: {
            //     element: HTMLInputElement,
            //     props: { //... },
            //     state: { value: //... }
            //     setState: ƒ setState(newState) {
            //         // Method to update file instance
            //         // Returns newState
            //     }
            // }
        }
        ```

        -   File state only updates when `instance.setState()` is called, thus if not called on element modification, UI and file state could be out of sync.

    -   **examples**

        -   Filter element value on input event and update/sync the UI with the file instance.

        ```js
        events: {
            input: (event, instance) => {
                const state = { ...instance.state };
                // Filter value on input event
                state.value = event.target.value.slice().replace(/[^a-zA-z]*/g, '');
                // Set and sync UI and I/O states
                event.target.value = instance.setState({ ...state }).value;
            },
        }
        ```

        -   Filter element using hidden prop key for multiple FSFormGroup components and event types and update/sync the UI with the file instance.

        ```js
        function filterAndHandleEvent(event, instance) {
            // Create regex pattern using hidden props
            const regex = new RegExp(instance.props._regex, 'g');
            // Shallow copy state
            const state = { ...instance.state };
            // Filter value on input event using passed regex pattern
            state.value = event.target.value.slice().replace(regex, '');
            // Set and sync UI and I/O states
            event.target.value = instance.setState({ ...state }).value;
        }

        // First FSFormGroup.inputGroup() instance
        props: { _regex: '[^a-zA-z]*', }, // Only allow letters
        events: {
            input: { filterAndHandleEvent },
            change: { filterAndHandleEvent },
        }

        // Second FSFormGroup.inputGroup() instance
        props: { _regex: '[^0-9]*', }, // Only allow numbers
        events: {
            input: { filterAndHandleEvent },
            change: { filterAndHandleEvent },
        }
        ```

-   ### **props**

    -   **keys**
        -   [`...DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString)
            -   Popular: `type`, `class`, `name`
            -   Default: `type="text"`
        -   `...string` (hidden)
            -   A key name beginning with an underscore character is regarded as a hidden prop, and is not attached to `element`, but can be accessed via `callbackFn.instance.props`
            -   Example:
                -   Define: `props: { _regex: '[^0-9*]' }`
                -   Use: `instance.props._regex`
    -   **values**

        -   [`...DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString)
        -   `...any` (hidden)

    -   **examples**

        -   Filter element using hidden prop key for multiple FSFormGroup components and event types and update/sync the UI with the file instance.

        ```js
        props: {
            type: 'text',
            tabindex: '-1',
            class: 'bg-transparent text-white border-0',
            _regex: '[^0-9]*', // Hidden
        },
        state: {
            value: 'Initial text value'
        }

        // Returns HTMLElement
        // <div>
        //     <div>
        //         <input
        //             type="text"
        //             tabindex="-1"
        //             class="bg-transparent text-white border-0"
        //             value="Initial text value"
        //         />
        //     </div>
        // </div>
        ```

-   ### **state**

    -   **keys**
        -   `value` (required)
            -   Initial value to set for `element`
        -   `...string`
    -   **values**

        -   `...any`

    -   **type**

        -   Input:

            -   `[ { value: (string,number) } ]`
            -   `{ value: (string,number) }`
            -   `string`
            -   `number`

        -   Output:
            -   `[ { value: (string,number) } ]`

    -   **examples**

        -

        ```js
        props: {
            type: 'text',
            tabindex: '-1',
            class: 'bg-transparent text-white border-0',
            _regex: '[^0-9]*', // Hidden
        },
        state: {
            value: 'Initial text value'
        }

        // Returns HTMLElement
        // <div>
        //     <div>
        //         <input
        //             type="text"
        //             tabindex="-1"
        //             class="bg-transparent text-white border-0"
        //             value="Initial text value"
        //         />
        //     </div>
        // </div>

        // JSON file instance
        // { "group0": [{ "value": "Initial text value" }] }
        ```

## **Examples**

### Use saved JSON states; otherwise use default states.

```js
/**
 * Check if a file exists and use existing saved states.
 */
(function useSavedFileStates() {
    // A global object of all FSFormGroup options, with default states
    const groups = {
        group0: {
            groupKey: 'group0',
            heading: 'Group 0',
            description: 'Input groups.',
            props: { type: 'text' },
            // Default states
            state: [{ value: 'hello' }, { value: 'world!' }],
            events: { input: inputEventHandler },
        },
        group1: {
            groupKey: 'group1',
            heading: 'Group 1',
            description: 'Removable input groups.',
            max: 10,
            props: { type: 'number' },
            // Default states
            state: [{ value: 5 }, { value: 10 }, { value: 15 }],
            events: { input: inputEventHandler },
        },
    };
    try {
        /**
         * Test if passed property/key exists in the parent object
         * and has at least one child object.
         * @param {Object} parent Parent object path.
         * @param {string} test Property name.
         * @returns {boolean} True if the property exists.
         */
        const propertyExists = (parent, test) => {
            if (parent.hasOwnProperty(test) && parent[test] && Object.keys(parent[test]).length > 0) {
                return true;
            }
            return false;
        };

        // Try to read and parse the file as a json object
        const objFile = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        // Update to use existing file states
        for (const groupKey in groups) {
            if (propertyExists(objFile, groupKey) === true) {
                groups[groupKey].state = objFile[groupKey].slice();
            }
        }
    } catch (err) {}
})();
```

### Electron Example.

#### **main.js**

```js
// Imports
const { app, BrowserWindow } = require('electron');

/**
 * Initialise main render
 */
function createWindow() {
    const win = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        title: 'FSFormGroup',
        width: 320,
        height: 544,
        minWidth: 320,
        minHeight: 544,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });

    // Pretty start
    win.once('ready-to-show', () => {
        win.show();
    });

    // Load file
    win.loadFile('Public/index.html');

    // win.webContents.openDevTools(); // Show WebDev Tools
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
```

#### **Public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="stylesheet" href="src/fs-fg.css" />
        <meta charset="UTF-8" />
        <meta name="author" content="fatherbrennan" />
        <title>FS Module Form Group</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'self';script-src 'self'" />
    </head>

    <body>
        <div id="form"></div>
        <script src="js/app.js"></script>
    </body>
</html>
```

#### **Public/js/app.js**

```js
// Dependencies
const fs = require('fs');
const path = require('path');
const FSFormGroup = require('fs-form-group');

/**
 * Initalise application preferences variable.
 * -> Saves states to JSON file.
 * -> Reads JSON file on application startup; uses saved states or fallback to default states.
 * -> Creates an interactive HTML form for user input; and save valid updates to JSON file.
 * -> HTML form attaches feedback block on invalid user input.
 */
const preferences = (function initPreferences() {
    const jsonPath = path.join(__dirname, 'src', 'Preferences', 'preferences.json');

    /**
     * Feedback block handler for active component.
     * @property {node|element} element New component state defined by user input.
     * @property {node} parentNode Initial state of component.
     * @property {function} removeFeedback Remove feedback class to feedback block.
     * @property {function} setFeedback Add feedback class to feedback block.
     * @property {function} init Cache elements and insert feedback block into the DOM.
     * @property {function} reset Reset all properties to default and remove feedback block from the DOM.
     */
    const feedback = {
        element: null,
        parentNode: null,
        removeFeedback: function (feedback) {
            this.element.classList.remove(feedback);
            return true;
        },
        setFeedback: function (feedback) {
            this.element.classList.add(feedback);
            return false;
        },
        init: function (element) {
            this.element = (function () {
                const div = document.createElement('div');
                div.setAttribute('class', 'fs-fg-feedback');
                return div;
            })();
            this.parentNode = element.parentNode;
            this.parentNode.insertBefore(this.element, element);
        },
        reset: function () {
            this.parentNode.removeChild(this.element);
            this.parentNode = null;
            this.element = null;
        },
    };

    /**
     * Track focused component state (for validity)
     * @property {object} new New component state defined by user input.
     * @property {object} old Initial state of component.
     * @property {boolean} valid True if `new` is valid.
     * @property {function} reset Reset all properties to default.
     */
    const activeState = {
        new: null,
        old: null,
        valid: true,
        reset: function () {
            this.new = null;
            this.old = null;
            this.valid = true;
        },
    };

    /**
     * Filter user input to allow integers only.
     * @param {event} e HTML Event.
     * @returns {number} Input value as an integer.
     */
    function intFilter(e) {
        const a = e.target.value.slice().replace(/\D*/g, '');
        // Set UI
        e.target.value = a;
        // Feedback
        if (a === '') {
            feedback.setFeedback('nan');
            activeState.valid = false;
            return a;
        } else feedback.removeFeedback('nan');
        return +a;
    }

    function inputEventHandler(event, instance) {
        const state = { ...instance.state };
        // Assume valid state before filtering
        activeState.valid = true;
        // Filter and sync UI/file states
        state.value = instance.props.hasOwnProperty('_filter') ? instance.props._filter(event) : event.target.value;
        // Set new states
        activeState.new = instance.setState({ ...state });
    }

    function focusEventHandler(event, instance) {
        // Cache initial component state
        activeState.old = { ...instance.state };
        // Initialise feedback node for active component
        feedback.init(instance.element);
        // Filter
        if (instance.props.hasOwnProperty('_filter')) instance.props._filter(event);
    }

    function blurEventHandler(event, instance) {
        // Revert to old valid state (and sync component state with UI state)
        if (activeState.valid === false) event.target.value = instance.setState({ ...activeState.old }).value;
        // Reset defaults
        feedback.reset();
        activeState.reset();
    }

    const groups = {
        group0: {
            groupKey: 'group0',
            heading: 'Group 0',
            description: 'Only allow integer input',
            max: 4,
            props: {
                type: 'text',
                placeholder: 'Integer.',
                _filter: intFilter,
            },
            // Default
            state: 1,
            events: {
                blur: blurEventHandler,
                focus: focusEventHandler,
                input: inputEventHandler,
            },
        },
        group1: {
            groupKey: 'group1',
            heading: 'Group 1',
            max: 8,
            props: {
                type: 'text',
                placeholder: 'Text',
            },
            // Default
            state: [{ value: 'hello' }, { value: 'world!' }],
            events: {
                blur: blurEventHandler,
                focus: focusEventHandler,
                input: inputEventHandler,
            },
        },
    };

    /**
     *
     * Check if a file exists and use saved states if they exist.
     */
    (function useSavedFileStates() {
        try {
            /**
             * Test if passed property/key exists in the parent object
             * and has at least one child object.
             * @param {object} parent Parent object path.
             * @param {string} test Property name.
             * @returns {boolean} True if the property exists.
             */
            const propertyExists = (parent, test) => {
                if (parent.hasOwnProperty(test) && parent[test] && Object.keys(parent[test]).length > 0) {
                    return true;
                }
                return false;
            };

            // Try to read and parse the file as a json object
            const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

            // Use existing file states
            for (const groupKey in groups) {
                if (propertyExists(json, groupKey) === true) {
                    groups[groupKey].state = json[groupKey].slice();
                }
            }
        } catch (e) {}
    })();

    const form = new FSFormGroup(jsonPath, null, {
        formGroup: 'fs-fg',
        formGroupHeading: 'fs-fg-heading',
        formGroupDescription: 'fs-fg-description',
        formGroupComponent: 'fs-fg-component',
        formGroupInput: 'fs-fg-input',
    });

    const f = new DocumentFragment();

    // Build document fragment with removable input form groups
    for (const groupKey in groups) {
        f.appendChild(form.removableInputsGroup(groups[groupKey]));
    }

    // Insert form fragment in DOM
    document.getElementById('form').appendChild(f);

    return form;
})();

// View latest preferences states
console.log(preferences.getData());
```

#### **Public/css/app.css**

```css
:root {
    --primary-color: #fff;
    --secondary-color: #dfdfdf;
    --primary-background: #1e1e1e;
    --secondary-background: #2c2c2c;
    --tertiary-background: #3c3c3c;
    --active-primary: #008080;
    --error: #f08080;
    --highlight: #00ffff77;
}
::-webkit-scrollbar {
    display: none;
}
::selection {
    background-color: var(--highlight);
}
*,
:before,
:after {
    box-sizing: border-box;
}
body {
    font-family: sans-serif;
    color: var(--primary-color);
    background-color: var(--primary-background);
    color: #00ffff;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
/* Form Group CSS */
.fs-fg {
    font-size: 0.75rem;
    color: var(--secondary-color);
    margin-bottom: 0.75em;
    padding: 0.25em;
    min-width: 100%;
    max-width: fit-content;
    line-height: 1em;
}
.fs-fg:hover {
    background-color: var(--secondary-background);
}
.fs-fg-heading {
    font-size: inherit;
    font-weight: 600;
    margin-top: 0;
}
.fs-fg-description {
    font-weight: 300;
}
.fs-fg-component {
    position: relative;
    display: flex;
    flex-direction: row;
}
.fs-fg-input[type='button'] {
    background-color: var(--active-primary);
    max-width: max-content;
}
.fs-fg-input:focus {
    border-color: var(--active-primary);
}
.fs-fg-feedback:after {
    background-color: var(--error);
    border-bottom-left-radius: 0.25em;
    border-bottom-right-radius: 0.25em;
    bottom: -1.25em;
    left: 0;
    padding-left: 0.25em;
    padding-right: 0.25em;
    padding-bottom: 0.25em;
    position: absolute;
    z-index: 2;
}
.fs-fg-feedback.nan:after {
    content: 'NaN';
}
.fs-fg-feedback.nan + .fs-fg-input {
    border-color: var(--error);
}
.fs-fg-input {
    background-color: transparent;
    border-width: 0.1em;
    border-style: solid;
    border-color: var(--tertiary-background);
    color: var(--secondary-color);
    outline: 0;
    width: 100%;
}
.fs-fg-component,
.fs-fg-description,
.fs-fg-heading {
    margin-bottom: 0.25em;
}
```

#### **Public/src/Preferences.preferences.json**

```json
{ "group0": [{ "value": 1 }], "group1": [{ "value": "hello" }, { "value": "world!" }] }
```
