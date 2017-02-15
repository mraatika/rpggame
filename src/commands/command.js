import { values } from 'lodash';
import CommandDispatcher from './commanddispatcher';
import CommandTypes from './commandtypes';

/**
 * @class Command
 * @description Super class for all the command classes
 */
export default class Command {

    /**
     * @constructor
     * @param       {CommandType} type
     * @param       {Object} [props={}]
     * @return      {Command}
     */
    constructor(type, props = {}) {
        if (!values(CommandTypes).indexOf(type) === -1) {
            throw new Error('InvalidArgumentsException: Type invalid or missing!');
        }
        Object.assign(this, props, { type });
        // validate implicitly
        this.validate();
    }

    /**
     * Validate all the values that have validators in the validations hash
     * @throws {Error} throws if invalid
     * @return {undefined}
     */
    validate() {
        const { validations } = this;

        return Object.keys(validations).forEach((key) => {
            const validator = validations[key];
            const value = this[key];

            if (typeof validator === 'function') {
                const error = validator(value);
                if (error) {
                    throw new Error(`ValidationError: ${key} ${error}!`);
                }
            }
        });
    }

    /**
     * Dispatch this command via CommandDispatcher
     */
    dispatch() {
        CommandDispatcher.dispatch(this);
    }
}
