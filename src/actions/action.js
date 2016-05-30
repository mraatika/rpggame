/**
 * @class Action
 * @description A super class for all actions
 */
export default class Action {

    constructor(command) {
        this.actor = command.actor;
        this.command = command;
        this.isDone = false;
        this.pending = false;
    }

    /**
     * Execute phase of action
     * @abstract
     */
    execute() {
        throw new Error('Inheriting class should implement execute method!');
    }

    /**
     * Clean up method. Inheriting class should implement this if necessary
     */
    dispose() {}
}