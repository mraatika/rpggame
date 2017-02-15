import { values } from 'lodash';
import ActionTypes from '../constants/actiontypes';
import validator from '../utils/validations';

/**
 * @export
 * @class Action
 * @description Class to represent an action
 */
export default class Action {
    /**
     * @readonly
     * @memberOf Action
     */
    get validations() {
        return {};
    }

    /**
     * Creates an instance of Action.
     * @param {CommandType} type
     * @param {Object} [props={}]
     * @memberOf Action
     */
    constructor(type, props = {}) {
        if (!type) {
            throw new Error('InvalidArgumentsException: action type is missing!');
        }

        if (values(ActionTypes).indexOf(type) === -1) {
            throw new Error('InvalidArgumentsException: action type is invalid!');
        }

        this.isDone = false;
        this.pending = false;
        this.priority = 0;

        Object.assign(this, props);

        validator(this)(this.validations);
    }

    /**
     * Execute this action. Should be implemented by subclass.
     * @virtual
     * @memberOf Action
     */
    execute() {
        throw new Error('Execute method should be implemented by subclass!');
    }

    /**
     * Called when this action is destroyed.
     * @memberOf Action
     */
    dispose() {}
}
