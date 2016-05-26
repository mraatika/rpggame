import Action from 'actions/action';
import Mover from 'movement/mover';
import CommandEmitter from 'commands/commandemitter';
import MoveCommand from 'commands/movecommand';
import ActionTypes from 'actions/actiontypes';

/**
 * @class MovementAction
 * @description A class representing movement to a point
 * @extends {Action}
 */
export default class MovementAction extends Action {

    get type() {
        return ActionTypes.MOVE_ACTION;
    }

    /**
     * @constructor
     * @param       {paramType}
     * @return      {MovementAction}
     */
    constructor(turn) {
        super(turn);

        this.turn = turn;
        this.movementPoints = turn.actor.throwMovement();
        this.isDone = false;
        this.isLocked = false;
        this._mover = new Mover(turn.game, turn.actor);

        console.log(`THREW ${this.movementPoints} MOVEMENT POINTS FOR ${this.turn.actor.name}`);
    }

    dispose() {
        this.isDone = true;
        this.movementStrategy.dispose();
    }

    decide() {
        if (this.isLocked) return;

        const movementStrategy = this.movementStrategy = this._decideMovementStrategy();
        const path = this.movementStrategy.path;

        if (!this.movementPoints || (!path.length && movementStrategy.isMovementFinished)) {
            this.dispose();
            return;
        }

        if (path.length) {
            CommandEmitter.dispatch(new MoveCommand({
                actor: this.turn.actor,
                path: path,
                isMovementFinished: movementStrategy.isMovementFinished
            }));
        }
    }

    execute(command) {
        this.movementPoints -= command.path.length;

        console.log('Movement points left:', this.movementPoints);

        this.isLocked = true;

        this.movementStrategy.onMoveStart();

        if (!command.point && command.isMovementFinished) {
            this.dispose();
        }

        // move the actor to given point
        this._mover.movePath(command.path, () => {
            this.isLocked = false;
            this.movementStrategy.onMoveEnd();
        });
    }
}