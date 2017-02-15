/**
 * @class Action
 * @description A super class for all actions
 */
export default class Action {

    /**
     * @constructor
     * @param       {Command} command
     * @return      {Action}
     */
    constructor(command) {
        this.actor = command.actor;
        this.command = command;
        this.isDone = false;
        this.pending = false;
        this.priority = 0;
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
