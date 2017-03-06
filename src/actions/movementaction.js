import action from './action';
import ActionTypes from '../constants/actiontypes';
import mover from '../movement/mover';
import { shouldBeActorSprite, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @class MovementAction
 * @description A class representing movement to a point
 * @extends {Action}
 */
export default function movementAction(game, command = {}) {
    const { actor, path = [] } = command;

    const validations = {
        game: (value) => {
            if (!value) return 'is missing';
            if (!(value.add || {}).tween) return 'is invalid';
            return undefined;
        },
        actor: shouldBeActorSprite,
        path: shouldBeInstanceOf(Array),
    };

    const methods = {
        /**
         * @return {Boolean}
         * @memberOf MovementAction
         */
        execute() {
            const pathWithoutCurrentPoint = this.path.slice(1);

            if (!pathWithoutCurrentPoint.length) { return false; }

            if (pathWithoutCurrentPoint.length > this.actor.movementPoints) {
                return false;
            }

            this.pending = true;

            this.actor.movementPoints -= pathWithoutCurrentPoint.length;

            mover(game, actor).movePath(pathWithoutCurrentPoint, () => {
                this.pending = false;
            });

            return true;
        },
    };

    return Object.assign(
        action(ActionTypes.MOVE_ACTION, validations, { actor, path, game }),
        methods,
    );
}
