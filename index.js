/**
 * fs-form-group
 * MIT Licensed
 *
 * @fatherbrennan
 */
'use strict';
class FSFormGroup {
    css = {
        formGroup: '',
        formGroupHeading: '',
        formGroupDescription: '',
        formGroupComponent: '',
        formGroupInput: '',
    };
    options = {
        encoding: 'utf8',
        space: 0,
    };
    path = '';
    _components = {};
    _groupKey = 0;

    /**
     * Create a new file instance to save object states.
     * @param {string} path Valid file path to use.
     * @param {{
     * encoding: string,
     * space: number,
     * }} [options={ encoding: 'utf8', space: 0 }] Object containing options (for JSON stringification and parsing). Default: `{ encoding: 'utf8', space: 4 }`
     * @param {{
     * formGroup: string,
     * formGroupComponent: string,
     * formGroupDescription: string,
     * formGroupHeading: string,
     * formGroupInput: string,
     * }} [css] Object of defined string values representing the class/es to add to every defined component instance.
     * @example
     * const form = new FSFormGroup(
     *     './path/to/file.json',
     *     {
     *         encoding: 'utf8',
     *         spaces: 2,
     *     },
     *     {
     *         formGroup: 'fg-dark-theme',
     *         formGroupHeading: 'fg-dark-theme-heading',
     *         formGroupDescription: 'fg-dark-theme-description',
     *         formGroupComponent: 'fg-dark-theme-component',
     *         formGroupInput: 'fg-dark-theme-input',
     *     }
     * );
     */
    constructor(path, options, css) {
        if (options) {
            this.options.encoding = options.encoding || this.options.encoding;
            this.options.space = options.space || this.options.space;
        }
        if (css) {
            this.css.formGroup = css.formGroup || this.css.formGroup;
            this.css.formGroupComponent = css.formGroupComponent || this.css.formGroupComponent;
            this.css.formGroupDescription = css.formGroupDescription || this.css.formGroupDescription;
            this.css.formGroupHeading = css.formGroupHeading || this.css.formGroupHeading;
            this.css.formGroupInput = css.formGroupInput || this.css.formGroupInput;
        }
        // Test path
        this.path = path;
        this._write({});
    }

    /**
     * Read and parse file.
     * @returns {object} Object from parsed JSON file.
     */
    _read() {
        try {
            return JSON.parse(fs.readFileSync(this.path, this.options.encoding));
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update the file and global object instance.
     */
    _update() {
        // Write updated states to file
        const states_w = {};
        for (let i = 0, keys = Object.keys(this._components), l = keys.length; i < l; i++) {
            states_w[keys[i]] = [];
            for (let j = 0, m = this._components[keys[i]].length; j < m; j++) states_w[keys[i]].push({ ...this._components[keys[i]][j].state });
        }
        this._write(states_w);
        // Read file and rerender components with updated states
        const states_r = this._read();
        for (let i = 0, keys = Object.keys(this._components), l = keys.length; i < l; i++)
            for (let j = 0, m = this._components[keys[i]].length; j < m; j++) {
                this._components[keys[i]][j].state = { ...states_r[keys[i]][j] };
                this._components[keys[i]][j].__render();
            }
    }

    /**
     * Parse to JSON string and write to file.
     * @param {object} data JavaScript object to parse and write to file.
     */
    _write(data) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(data, null, this.options.space), this.options.encoding);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @returns {element} Component wrapper element.
     */
    __createComponentWrapper(options) {
        const div = document.createElement('div');
        const classString = this.__getClassString(this.css.formGroupComponent, options.componentClass);
        if (classString) div.setAttribute('class', classString);
        return div;
    }

    /**
     * @param {string} text Initial text to render.
     * @returns {element} Form group description element.
     */
    __createElementDescription(options) {
        const p = document.createElement('p');
        const classString = this.__getClassString(this.css.formGroupDescription, options.descriptionClass);
        if (classString) p.setAttribute('class', classString);
        p.textContent = options.description;
        return p;
    }

    /**
     * @param {string} text Initial text to render.
     * @returns {element} Form group heading element.
     */
    __createElementHeading(options) {
        const h3 = document.createElement('h3');
        const classString = this.__getClassString(this.css.formGroupHeading, options.headingClass);
        if (classString) h3.setAttribute('class', classString);
        h3.textContent = options.heading;
        return h3;
    }

    /**
     * @param {object} options Object containing heading and description keys.
     * @returns {element} Form group wrapper element.
     */
    __createFormGroupWrapper(options) {
        const div = document.createElement('div');
        const classString = this.__getClassString(this.css.formGroup, options.groupClass);
        if (classString) div.setAttribute('class', classString);
        // Attach elements if defined
        if (options.heading) div.appendChild(this.__createElementHeading(options));
        if (options.description) div.appendChild(this.__createElementDescription(options));
        return div;
    }

    /**
     * Creates and returns an input group template with immutable props.
     * @param {object} props element properties.
     * @returns {element} Input element.
     */
    __createElementInput(props) {
        const input = document.createElement('input');
        props = props || {};
        // Set default input type to text if not set
        props.type = props.type || 'text';
        props.class = this.__getClassString(this.css.formGroupInput, props.class);
        for (let i = 0, keys = Object.keys(props), l = keys.length; i < l; i++) if (/^_+/.test(keys[i]) === false) input.setAttribute(keys[i], props[keys[i]]);
        return input;
    }

    /**
     * @param {string} a Default class name/s from init.
     * @param {string} b Passed class name.
     * @returns {string} Class string containing a and b if any.
     */
    __getClassString(a, b) {
        return a && b ? `${a} ${b}` : a && !b ? a : b ? b : '';
    }

    /**
     * Test validity of passed options on component creation.
     * Throw fatal errors.
     * @param {object} options Component options object to test validity.
     * @returns {{ state:[ { value: string|number } ] }} Valid options object.
     * `options.state` is transformed into an array of objects with a minimum `value` property.
     */
    __testOptions(options) {
        /**
         * Returns boolean indicating whether valid object exists.
         * @param {object} parent Parent object path.
         * @param {string} test Property name.
         * @returns {boolean} `true` if the property exists; `false` if the property does not exist.
         */
        const propertyExists = (parent, test) => {
            if (parent.hasOwnProperty(test) && parent[test]) return true;
            return false;
        };

        /**
         * Returns boolean indicating whether `test` is an object.
         * @param {object} test Test variable.
         * @returns {boolean} `true` if `test` is an object; `false` if `test` is not an object.
         */
        const isObject = test => {
            if (test instanceof Object === true && test instanceof Array === false && typeof test === 'object') return true;
            return false;
        };

        /**
         * Returns boolean indicating whether `test` is a string.
         * @param {object} test Test variable.
         * @returns {boolean} `true` if `test` is an string; `false` if `test` is not an string.
         */
        const isString = test => {
            if (typeof test === 'string' || test instanceof String) return true;
            return false;
        };

        // Throw error if options doesn't exist or is empty
        if (options === undefined || isObject(options) === false || Object.keys(options).length === 0) {
            throw new Error('Method requires exactly one options argument.');
        }

        // Test property (groupKey)
        if (propertyExists(options, 'groupKey') === true) {
            if (propertyExists(this._components, options.groupKey)) throw new Error('{groupKey} already exists in file.');
            if (isString(options.groupKey) === false) throw new TypeError('{groupKey} must be of type string.');
        }
        // Use default groupKey (groupN)
        else options.groupKey = `group${this._groupKey++}`;

        const validState = [];
        // Transform state prop to always return an array of objects
        if (propertyExists(options, 'state') === true) {
            /**
             *
             * @param {{}} state State object.
             * @returns {{value: string|number}} Valid state.
             */
            const getValidState = state => {
                /**
                 * Returns a valid state object.
                 * @param {string|number} validValue Valid value.
                 * @returns {{value: (string|number) }} Valid state object.
                 */
                const returnState = validValue => {
                    return { value: validValue };
                };

                /**
                 * Returns boolean indicating whether `test` is a string.
                 * @param {object} test Test variable.
                 * @returns {boolean} `true` if `test` is a string or number; `false` if `test` is not a string or number.
                 */
                const isValidValue = test => {
                    if (isString(test) === true || isNaN(test) === false) return true;
                    return false;
                };

                if (isObject(state) === true) {
                    if (propertyExists(state, 'value') === true) {
                        if (isValidValue(state.value)) return state;
                        return returnState('');
                    } else throw new Error('{state} object must include {value} key.');
                } else if (isValidValue(state)) return returnState(state);
                else throw new Error('invalid {state} argument.');
            };

            if (options.state instanceof Array) {
                const l = options.state.length;
                if (l > 0) for (let i = 0; i < l; i++) validState.push(getValidState(options.state[i]));
                else throw new Error('{state} is an empty array.');
            } else validState.push(getValidState(options.state));
            options.state = validState;
        } else throw new Error('{state} property must exist in options.');

        /**
         * @param {string} key Property name.
         * @returns {Array<{}>} Array of objects.
         */
        const getValidObject = key => {
            /**
             * @param {object} test Object to test.
             * @returns {object} Valid object.
             */
            const isValidObject = test => {
                if (isObject(test) === true) return test;
                else throw new Error(`{${key}} must be an object.`);
            };

            const arr = [];
            if (propertyExists(options, key) === true) {
                if (options[key] instanceof Array) {
                    const l = options[key].length;
                    if (l > 0) for (let i = 0; i < l; i++) arr.push(isValidObject(options[key][i]));
                    else throw new Error(`{${key}} is an empty array.`);
                } else arr.push(isValidObject(options[key]));
            }
            return arr;
        };

        // Test property (props, events)
        options.props = getValidObject('props');
        options.events = getValidObject('events');

        return options;
    }

    /**
     * Create a global instance of components to track states and elements in the DOM.
     * @param {string} groupKey Group identifier `key`.
     * @param {object} props Properties of the DOM instance (immutable).
     * @param {object} state Attributes containing the initial state values of the DOM instance (mutable).
     * @param {object} events Object keys equal to event types, and values representing attached functions.
     * @param {element|node} component component element.
     */
    _setElementInstance(groupKey, props, state, events, component) {
        if (this._components[groupKey] === undefined) this._components[groupKey] = [];

        // Create instance object
        const elementInstance = {
            element: component,
            props: { ...props },
            state: { ...state },
            setState(newState) {
                const state = { ...newState };
                this.state = state;
                this.__update();
                return state;
            },
            __init() {
                // Attach event handlers
                if (events) {
                    for (let i = 0, keys = Object.keys(events), l = keys.length; i < l; i++) {
                        if (events[keys[i]] instanceof Function === false) throw new Error('Event handler must be a function.');
                        const eventHandler = events[keys[i]].bind(this);
                        this.element.addEventListener(keys[i], e => eventHandler(e, this));
                    }
                }
            },
            __render() {
                for (let i = 0, keys = Object.keys(this.state), l = keys.length; i < l; i++) this.element.setAttribute(keys[i], this.state[keys[i]]);
                return this.element;
            },
            __update: this._update.bind(this),
        };

        // Add to global instances
        this._components[groupKey].push(elementInstance);
        // Render instance
        elementInstance.__init();
        // Update instance (and file)
        this._update();
    }

    /**
     * Runtime method to return the latest states from FSFormGroup instance.
     * @param {string=} groupKey Existing `groupKey` identifier. If not defined, all groups will be returned.
     * @returns {object} Object of latest state/s from FSFormGroup instance.
     * @example
     * document.getElementById('button').addEventListener('click', () => {
     *     // Collect latest states from FSFormGroup instance
     *     const data = FSFormGroup.getData();
     *
     *     // Loop through form groups
     *     for (const group in data) {
     *         console.log('data->group', group);
     *         // Loop through group states
     *         for (const state of data[group]) {
     *             console.log('data->group->state', state);
     *         }
     *     }
     * });
     */
    getData(groupKey) {
        return groupKey ? this._read()[groupKey] : this._read();
    }

    /**
     * A single input group component with a connected state and instance.
     * @param {{
     * groupKey:? string,
     * heading:? string,
     * description:? string,
     * groupClass:? string,
     * headingClass:? string,
     * descriptionClass:? string,
     * componentClass:? string,
     * events?: {
     *  EventType: function,
     * },
     * props?: {
     *  HTMLInputElementAttributes: string,
     * },
     * state: {
     *  value: string|number,
     *  HTMLInputElementAttributes:? string,
     * }|string|number,
     * }} options Object containing component options.
     * @returns {element} Group element of single input.
     * @example
     * const formInputGroup = FSFormGroup.inputGroup({
     *     heading: 'Input Group',
     *     description: 'Passing initial input value as an object.',
     *     groupClass: 'bg-dark text-white mb-1',
     *     headingClass: 'font-weight-bold',
     *     descriptionClass: 'small',
     *     componentClass: 'mb-1',
     *     events: {
     *         input: (event, instance) => {
     *             // Create regex pattern
     *             const regex = new RegExp('[^a-zA-z]*', 'g');
     *             // Shallow copy state
     *             const state = { ...instance.state };
     *             // Filter value on input event
     *             state.value = event.target.value.slice().replace(regex, '');
     *             // Set and sync UI and I/O states
     *             event.target.value = instance.setState({ ...state }).value;
     *         },
     *     },
     *     props: { type: 'text', class: 'text-right w-100 border border-info', placeholder: 'Pattern: [a-zA-Z].' },
     *     state: { value: 'Initial value' },
     * });
     * // Insert the component to the DOM
     * document.getElementById('container').appendChild(formInputGroup);
     */
    inputGroup(options) {
        const opt = this.__testOptions(options);
        const formWrapper = this.__createFormGroupWrapper(opt);
        const inputElement = this.__createElementInput(opt.props[0]);
        this._setElementInstance(opt.groupKey, opt.props[0], opt.state[0], opt.events[0], inputElement);
        const componentWrapper = this.__createComponentWrapper(opt);
        componentWrapper.appendChild(this._components[opt.groupKey][0].__render());
        formWrapper.appendChild(componentWrapper);
        return formWrapper;
    }

    /**
     * A component with multiple input group elements with connected states and instances.
     * @param {{
     * groupKey:? string,
     * heading:? string,
     * description:? string,
     * groupClass:? string,
     * headingClass:? string,
     * descriptionClass:? string,
     * componentClass:? string,
     * events?: [{
     *  EventType: function,
     * }],
     * props?: {
     *  HTMLInputElementAttributes: string,
     * },
     * state: [{
     *  value: string|number,
     *  HTMLInputElementAttributes:? string,
     * }]|[string]|[number],
     * }} options Object containing component options.
     * @returns {element} Group element of inputs.
     * @example
     * function filterInputEvent(event, instance) {
     *     // Create regex pattern using hidden props
     *     const regex = new RegExp(instance.props._regex, 'g');
     *     // Shallow copy state
     *     const state = { ...instance.state };
     *     // Filter value on input event using passed regex pattern
     *     state.value = event.target.value.slice().replace(regex, '');
     *     // Set and sync UI and I/O states
     *     event.target.value = instance.setState({ ...state }).value;
     * }
     *
     * const formInputsGroup = FSFormGroup.inputsGroup({
     *     heading: 'Input Group',
     *     description: 'Passing initial input value as an array of objects.',
     *     groupClass: 'bg-dark text-white mb-1',
     *     headingClass: 'font-weight-bold',
     *     descriptionClass: 'small',
     *     componentClass: 'mb-1',
     *     events: [
     *         // Length=2: No events attached to third instance (file will not get updated)
     *         { input: filterInputEvent },
     *         { input: filterInputEvent }
     *     ],
     *     props: [
     *         // Length=2: No props added to third instance
     *         {
     *             type: 'text',
     *             class: 'bg-transparent text-right w-100 border border-info',
     *             placeholder: 'Pattern: [a-zA-Z].',
     *             _regex: '[^a-zA-z]*' // Hidden property
     *         },
     *         {
     *             type: 'text',
     *             class: 'bg-white text-center w-100 border border-info',
     *             placeholder: 'Pattern: [0-9].',
     *             _regex: '[^0-9]*' // Hidden property
     *         },
     *     ],
     *     state: [
     *         { value: 'abcdefghij' },
     *         { value: '0123456789' },
     *         { value: 'File state will not update as no event calling Instance.setState() is called' }
     *     ],
     * });
     * // Insert the component to the DOM
     * document.getElementById('container').appendChild(formInputsGroup);
     */
    inputsGroup(options) {
        const opt = this.__testOptions(options);
        const formWrapper = this.__createFormGroupWrapper(opt);

        // Create and attach n input components
        for (let i = 0, l = opt.state.length < opt.props.length ? opt.props.length : opt.state.length; i < l; i++) {
            const inputElement = this.__createElementInput(opt.props[i]);
            this._setElementInstance(opt.groupKey, opt.props[i], opt.state[i], opt.events[i], inputElement);
            const container = this.__createComponentWrapper(opt);
            container.appendChild(this._components[opt.groupKey][i].__render());
            formWrapper.appendChild(container);
        }
        return formWrapper;
    }

    /**
     * A component with multiple removable input group elements with connected states and instances.
     * @param {{
     * groupKey:? string,
     * max:? number,
     * heading:? string,
     * description:? string,
     * groupClass:? string,
     * headingClass:? string,
     * descriptionClass:? string,
     * componentClass:? string,
     * events?: {
     *  EventType: function,
     * },
     * props?: {
     *  HTMLInputElementAttributes: string,
     * },
     * state: [{
     *  value: string|number,
     *  HTMLInputElementAttributes:? string,
     * }]|[string]|[number],
     * }} options Object containing component options.
     * @returns {element} Group element of removable inputs.
     * @example
     * const formRemovableInputsGroup = FSFormGroup.removableInputsGroup({
     *     heading: 'Input Group',
     *     description: 'Passing initial input value as an object.',
     *     max: 4, // Allow a maximum of 4 inputs (states)
     *     groupClass: 'bg-dark text-white mb-1',
     *     headingClass: 'font-weight-bold',
     *     descriptionClass: 'small',
     *     componentClass: 'mb-1',
     *     events: {
     *         input: function filterInputEvent(event, instance) {
     *             // Create regex pattern using hidden props
     *             const regex = new RegExp(instance.props._regex, 'g');
     *             // Shallow copy state
     *             const state = { ...instance.state };
     *             // Filter value on input event using passed regex pattern
     *             state.value = event.target.value.slice().replace(regex, '');
     *             // Set and sync UI and I/O states
     *             event.target.value = instance.setState({ ...state }).value;
     *         },
     *     },
     *     props: {
     *         type: 'text',
     *         class: 'bg-transparent text-right w-100 border border-info',
     *         placeholder: 'Pattern: [a-zA-Z].',
     *         _regex: '[^a-zA-z]*', // Hidden property
     *     },
     *     state: [1, 2, 3],
     * });
     * // Insert the component to the DOM
     * document.getElementById('container').appendChild(formRemovableInputsGroup);
     */
    removableInputsGroup(options) {
        const opt = this.__testOptions(options);
        const formWrapper = this.__createFormGroupWrapper(opt);

        // Test property (max)
        if (opt.hasOwnProperty('max') && opt.max) {
            opt.max = parseInt(opt.max);
            if (opt.max === NaN) throw new Error('{max} must be a number.');
        }
        // Use default
        else opt.max = 10;

        // Initialise properties
        opt.addNewButton = opt.addNewButton || {};
        opt.removeButton = opt.removeButton || {};

        // Set 'Add New' button object
        const addNewButton = {
            element: null,
            props: {
                ...opt.addNewButton,
                value: opt.addNewButton.value || 'Add New',
                type: 'button',
            },
            handle() {
                // Only show button if n components is less than the defined max number of components
                if (removableContainer.childNodes.length < opt.max) formWrapper.appendChild(this.element);
                else if (formWrapper.contains(this.element) === true) formWrapper.removeChild(this.element);
            },
        };

        // Set remove group button object
        const removeButton = {
            props: {
                ...opt.removeButton,
                type: 'button',
                value: opt.removeButton.value || 'x',
            },
        };

        // Set removable components container
        const removableContainer = document.createElement('div');

        /**
         * @param {number} index Initial instance index.
         * @param {Boolean} useTemplate Use empty component template.
         * @returns {element} Removable input component.
         */
        const _createComponent = (index, useTemplate) => {
            const componentWrapper = this.__createComponentWrapper(opt);
            const inputElement = this.__createElementInput(opt.props[0]);
            this._setElementInstance(
                opt.groupKey,
                opt.props[0],
                useTemplate === true
                    ? (function getStateTemplate() {
                          const state = { ...opt.state[0] };
                          for (let i = 0, keys = Object.keys(state), l = keys.length; i < l; i++) state[keys[i]] = '';
                          return state;
                      })()
                    : opt.state[index],
                opt.events[0],
                inputElement
            );

            /**
             * @returns The index of the active component.
             */
            const getIndex = () => {
                return Array.prototype.indexOf.call(removableContainer.childNodes, componentWrapper);
            };

            /**
             * Remove component from the container.
             */
            const removeComponent = () => {
                this._components[opt.groupKey].splice(getIndex(), 1);
                removableContainer.removeChild(componentWrapper);
                this._update();
            };

            // Remove component if loses focus and is empty
            inputElement.addEventListener('blur', () => {
                if (this._components[opt.groupKey][getIndex()].state.value === '') removeComponent();
                addNewButton.handle();
            });

            // Create and attach removable group button
            const buttonElement = this.__createElementInput(removeButton.props);

            // Remove component on click
            buttonElement.addEventListener('click', () => {
                removeComponent();
                addNewButton.handle();
            });

            // Attach group to container
            componentWrapper.appendChild(this._components[opt.groupKey][index].__render());
            componentWrapper.appendChild(buttonElement);

            return componentWrapper;
        };

        // Create and set the 'Add New' button
        addNewButton.element = this.__createElementInput(addNewButton.props);

        // Create and attach removable group button
        addNewButton.element.addEventListener('click', () => {
            // Add new component if n components is less than defined max components
            if (removableContainer.childNodes.length < opt.max) {
                const component = _createComponent(removableContainer.childNodes.length, true);
                removableContainer.appendChild(component);
                component.firstChild.focus();
            }
            addNewButton.handle();
        });

        // Create and attach n input components
        for (let i = 0, l = opt.state.length; i < l; i++) {
            // Limit even if the file has been modified directly
            if (i === opt.max) break;
            const component = _createComponent(i);
            removableContainer.appendChild(component);
        }

        formWrapper.appendChild(removableContainer);
        addNewButton.handle();
        return formWrapper;
    }
}

module.exports = FSFormGroup;
