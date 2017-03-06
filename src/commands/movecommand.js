import command from './command';
import commandTypes from '../constants/commandtypes';
import { shouldBeActorSprite, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @name MoveCommand
 * A command for moving an actor along a path
 * @param {ActorSprite} actor
 * @param {Phaser.Point[]} [path=[]]
 * @extends {Command}
 */
export default function moveCommand(actor, path = []) {
    /**
     * @readonly
     * @memberOf MoveCommand
     */
    const validations = {
        actor: shouldBeActorSprite,
        path: shouldBeInstanceOf(Array),
    };

    const methods = {
        /**
         * Ensure that actor has enough movement points
         * @returns {boolean}
         * @memberOf MoveCommand
         */
        prerequisite() {
            return actor.movementPoints >= (path.length - 1);
        },
    };

    return Object.assign(
        command(commandTypes.MOVE_COMMAND, validations, { actor, path }),
        methods,
    );
}
