import { values } from 'lodash';
import ActionTypes from '../constants/actiontypes';
import validator from '../utils/validations';

/**
 * @export
 * @name Action
 * Factory function for creating actions
 * @param {string} type
 * @param {Object} validations
 * @param {Object} [props={}]
 */
export default function createAction(type, validations = {}, props = {}) {
    if (!type) {
        throw new Error('InvalidArgumentsException: action type is missing!');
    }

    if (values(ActionTypes).indexOf(type) === -1) {
        throw new Error('InvalidArgumentsException: action type is invalid!');
    }

    // validate given props
    validator(props)(validations);

    const publicProps = Object.assign({
        type,
        isDone: false,
        pending: false,
        priority: 0,
    }, props);

    const methods = {
        /**
         * Execute this action. Should be implemented by subclass.
         * @virtual
         * @memberOf Action
         */
        execute() {
            throw new Error('Execute method should be implemented by subclass!');
        },
    };

    return Object.assign(
        publicProps,
        methods,
    );
}
