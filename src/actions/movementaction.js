import Action from 'actions/action';
import Mover from 'movement/mover';
import ActionTypes from 'actions/actiontypes';

/**
 * @class MovementAction
 * @description A class representing movement to a point
 * @extends {Action}
 */
export default class MovementAction extends Action {

    /**
     * Getter for action type
     * @return {Symbol}
     */
    get type() {
        return ActionTypes.MOVE_ACTION;
    }

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Command} command
     * @return      {MovementAction}
     */
    constructor(game, command) {
        super(command);
        this.path = command.path || [];
        this._mover = new Mover(game, this.actor);
    }

    /**
     * Execute this action
     * @return {boolean} Executed successfully?
     */
    execute() {
        const path = this.path.slice(1);

        if (!path.length) {
            return false;
        }

        if (path.length > this.actor.movementPoints) {
            return false;
        }

        this.pending = true;

        this.actor.movementPoints -= path.length;

        this._mover.movePath(path, () => {
            this.pending = false;

            if (!this.actor.movementPoints) {
                this.isDone = true;
            }
        });

        return true;
    }
}