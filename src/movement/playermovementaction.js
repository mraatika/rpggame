import MovementAction from 'movement/movementaction';
import UserMovementStrategy from 'movement/usermovementstrategy';

export default class PlayerMovementAction extends MovementAction {
    constructor(...params) {
        super(...params);
    }

    _decideMovementStrategy() {
        return this.movementStrategy || (this.movementStrategy = new UserMovementStrategy(this));
    }
}