import Action from './action';
import ActionTypes from './actiontypes';
import Mover from '../movement/mover';

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
        this.game = game;
        this.path = command.path || [];
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

        new Mover(this.game, this.actor).movePath(path, () => {
            this.pending = false;
        });

        return true;
    }
}
