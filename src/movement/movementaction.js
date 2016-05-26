import {defer} from 'lodash';
import Mover from 'movement/mover';
//import MoveCommand from 'commands/movecommand';

const TYPE = Symbol('MOVE_ACTION');

export default class MovementAction {

    get type() {
        return TYPE;
    }

    /**
     * @constructor
     * @param       {paramType}
     * @return      {MovementAction}
     */
    constructor(turn) {
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

    execute() {
        const movementStrategy = this.movementStrategy = this._decideMovementStrategy();

        defer(() => {
            const nextPoint = movementStrategy.getNextPoint();

            if (!this.movementPoints || (!nextPoint && movementStrategy.isMovementFinished)) {
                this.dispose();
                return;
            }

            if (nextPoint) {
                this.moveToNextPoint(nextPoint, movementStrategy.isMovementFinished);
            }
        });
    }

    moveToNextPoint(point, isMovementFinished) {
        this.movementPoints--;

        console.log('Movement points left:', this.movementPoints);

        this.isLocked = true;

        if (!point && isMovementFinished) {
            this.dispose();
        }

        // move the actor to given point
        this._mover.moveTo(point, () => {
            this.isLocked = false;
        });
    }
}