/**
 * @class Action
 * @description A super class for all actions
 */
export default class Action {

    /**
     * Decide phase of action
     * @abstract
     */
    decide() {
        throw new Error('Inheriting class should implement decide method!');
    }

    /**
     * Execute phase of action
     * @abstract
     */
    execute() {
        throw new Error('Inheriting class should implement execute method!');
    }

    /**
     * Clean up method. Inheriting class should implement this
     * if necessary
     */
    dispose() {}
}