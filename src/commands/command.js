import commandTypes from '../constants/commandtypes';
import validator from '../utils/validations';

/**
 * @export
 * @name Command
 * @description Super class for all the command classes
 */
export default function createCommand(type, validations = {}, props = {}) {
    if (!type) {
        throw new Error('InvalidArgumentsException: Command type is missing!');
    }

    if (!commandTypes[type]) {
        throw new Error('InvalidArgumentsException: Command type is invalid!');
    }

    // validate implicitly
    validator(props)(validations);

    const publicProps = Object.assign(
        { type },
        props,
    );

    const methods = {
        /**
         * Check if fulfills prerequisites to send this command
         * @returns {boolean}
         * @memberOf Command
         */
        prerequisite: () => true,
    };

    return Object.assign(
        publicProps,
        methods,
    );
}
