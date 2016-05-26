import MovementAction from 'actions/movementaction';
import UserMovementStrategy from 'movement/usermovementstrategy';

/**
 * @class PlayerMovementAction
 * @description Player controlled unit's movement action
 */
export default class PlayerMovementAction extends MovementAction {
    /**
     * Select strategy for moving. This is always an instance of UserMovementStrategy
     * @private
     * @return  {UserMovementStrategy}
     */
    _decideMovementStrategy() {
        return this.movementStrategy || (this.movementStrategy = new UserMovementStrategy(this));
    }
}