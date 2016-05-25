import CommandTypes from 'commands/commandtypes';
import _ from 'lodash';

/**
 * @class Command
 * @description Super class for all the command classes
 */
export default class Command {

    /**
     * @constructor
     * @param       {CommandType} type
     * @param       {Object} props
     * @return      {Command}
     */
    constructor(type, props = {}) {
        if (!this._isCorrectType(type)) {
            throw new Error('InvalidArgumentsException: Type invalid or missing!');
        }
        this.type = type;
        this.validations = {};
        this.props = props;
    }

    /**
     * Validate all the values that have validators in the validations hash
     * @throws {Error} throws if invalid
     * @return {undefined}
     */
    validate() {
        return _.each(this.validations, (validator, key) => {
            const value = this.props[key];

            if (typeof validator == 'function') {
                const error = validator(value);

                if (error) {
                    throw new Error(`ValidationError: ${key} ${error}!`);
                }
            }
        });
    }

    /**
     * Validate command type
     * @private
     * @param   {CommandType} type
     * @return  {boolean}
     */
    _isCorrectType(type) {
        return _.chain(CommandTypes)
            .toArray()
            .find(s => s == type)
            .value();
    }
}