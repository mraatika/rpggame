import { values } from 'lodash';
import CommandDispatcher from './commanddispatcher';
import CommandTypes from '../constants/commandtypes';
import validator from '../utils/validations';

/**
 * @export
 * @class Command
 * @description Super class for all the command classes
 */
export default class Command {
    /**
     * @readonly
     * @memberOf Command
     */
    get validations() {
        return {};
    }
    /**
     * @constructor
     * @param       {CommandType} type
     * @param       {Object} [props={}]
     * @memberOf Command
     */
    constructor(type, props = {}) {
        if (!type) {
            throw new Error('InvalidArgumentsException: Command type is missing!');
        }

        if (values(CommandTypes).indexOf(type) === -1) {
            throw new Error('InvalidArgumentsException: Command type is invalid!');
        }

        Object.assign(this, props, { type });

        // validate implicitly
        validator(this)(this.validations);
    }
    /**
     * Dispatch this command via CommandDispatcher
     * @memberOf Command
     */
    dispatch() {
        CommandDispatcher.dispatch(this);
    }
}
