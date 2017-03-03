import Command from './command';
import CommandTypes from '../constants/commandtypes';
import { shouldBeActorSprite, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @class MoveCommand
 * @description A command for moving an actor along a path
 * @extends {Command}
 */
export default class MoveCommand extends Command {
    /**
     * @readonly
     * @memberOf MoveCommand
     */
    get validations() {
        return {
            actor: shouldBeActorSprite,
            path: shouldBeInstanceOf(Array),
        };
    }
    /**
     * Creates an instance of MoveCommand.
     * @param {Actor} actor
     * @param {Phaser.Point[]} [path=[]]
     * @memberOf MoveCommand
     */
    constructor(actor, path = []) {
        super(CommandTypes.MOVE_COMMAND, { actor, path });
    }

    /**
     * Ensure that actor has enough movement points
     * @returns {boolean}
     * @memberOf MoveCommand
     */
    prerequisite() {
        return this.actor.movementPoints >= (this.path.length - 1);
    }
}
