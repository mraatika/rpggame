import Game from '../game/game';
import Action from './action';
import ActionTypes from '../constants/actiontypes';
import Mover from '../movement/mover';
import { shouldBeActorSprite, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @class MovementAction
 * @description A class representing movement to a point
 * @extends {Action}
 */
export default class MovementAction extends Action {
    /**
     * @readonly
     * @memberOf MovementAction
     */
    get validations() {
        return {
            game: shouldBeInstanceOf(Game),
            actor: shouldBeActorSprite,
            path: shouldBeInstanceOf(Array),
        };
    }

    /**
     * Creates an instance of MovementAction.
     * @param {Game} game
     * @param {Command} command
     * @memberOf MovementAction
     */
    constructor(game, command) {
        const { actor, path = [] } = command;
        super(ActionTypes.MOVE_ACTION, { actor, path, game });
    }

    /**
     * @return {Boolean}
     * @memberOf MovementAction
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
