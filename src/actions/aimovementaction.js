import {Point} from 'phaser';
import {some} from 'lodash';
import MovementAction from 'actions/movementaction';
import MapUtils from 'common/maputils';
import WanderMovementStrategy from 'movement/wandermovementstrategy';
import AttackMovementStrategy from 'movement/attackmovementstrategy';
import StandStillMovementStrategy from 'movement/standstillmovementstrategy';

export default class AIMovementAction extends MovementAction {
    /**
     * @constructor
     * @param       {paramType}
     * @return      {AIMovementAction}
     */
    constructor(...params) {
        super(...params);
    }

    _decideMovementStrategy() {
        const {target, x, y} = this.turn.actor;
        const actorPosition = MapUtils.getTilePositionByCoordinates(new Point(x, y));
        const targetPosition = MapUtils.getTilePositionByCoordinates(new Point(target.x, target.y));

        let strategyClass;
        let params = [this];

        if (this._isTargetWithinAttackRange(actorPosition, targetPosition)) {
            strategyClass = StandStillMovementStrategy;
        } else  if (this.turn.actor.hasSeenTarget || this._isTargetWithinAggroArea(actorPosition, targetPosition)) {
            this.turn.actor.hasSeenTarget = true;
            strategyClass = AttackMovementStrategy;
            params.push(target);
        } else {
            strategyClass = WanderMovementStrategy;
        }

        const strategyInstance = (this.movementStrategy instanceof strategyClass) ? this.movementStrategy : new strategyClass(...params);
        this.movementStrategy = strategyInstance;

        return strategyInstance;
    }

    _isTargetWithinAggroArea(actorPosition, targetPosition) {
        const aggroDistance = this.turn.actor.aggroDistance;
        const aggroArea = MapUtils.getAreaOfRadius(actorPosition, aggroDistance);
        return this._isTargetInArea(aggroArea, targetPosition);
    }

    _isTargetWithinAttackRange(actorPosition, targetPosition) {
        const surroundings = MapUtils.getSurroundingTiles(actorPosition);
        return this._isTargetInArea(surroundings, targetPosition);
    }

    _isTargetInArea(area, targetPosition) {
        return some(area, tile => {
            return MapUtils.isSameTile(targetPosition, tile);
        });
    }
}