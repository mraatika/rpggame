import {Point} from 'phaser';
import gameConfig from 'json!assets/config/gameconfig.json';
import Actor from 'sprites/actor';
import MapUtils from 'common/maputils';
import Sequence from 'common/sequence';
import TurnPhases from 'common/turnphases';
import WanderMovementStrategy from 'movement/wandermovementstrategy';
import AttackMovementStrategy from 'movement/attackmovementstrategy';
import CommandDispatcher from 'commands/commanddispatcher';

/**
 * Enemy configurations from game config
 * @type {object}
 */
const config = gameConfig.enemy;

/**
 * @class Enemy
 * @description
 * @extends {Actor}
 */
export default class Enemy extends Actor {
    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {Enemy}
     */
    constructor(game, x, y, props = {}) {
        super(game, x, y, /*props.imageKey*/'enemy');

        this.id = Sequence.next();

        this.name = props.name || 'MAD KNIGHT';

        this.level = props.level || 1;
        this.health = props.health || config.intialHealth;
        this.gold = this._throwForInitialGold();

        this.attack = props.attack || 2;
        this.defence = props.defence || 2;
        this.movement = props.movement || config.movement;
        this.actionPoints = config.actionPoints;

        this.aggroDistance = props.aggroDistance || config.defaultAggroDistance;

        this.target = props.target;
        this.hasSeenTarget = false;
    }

    decideAction(turn) {
        const isTargetWithinAttackRange = MapUtils.isOnSurroundingTile(this, this.target);
        const phase = turn.currentPhase;

        // if target is within attack range (surrounding tiles)
        if (isTargetWithinAttackRange) {
            // if turn's phase is action phase then attack
            if (phase === TurnPhases.ACTION_PHASE) {
                CommandDispatcher.attack(this, this.target);
            // if turn's phase is move phase then skip movement
            } else if (phase === TurnPhases.MOVE_PHASE) {
                CommandDispatcher.endAction(this);
            }
            return;
        }

        // if current phase is move phase and the actor still has movement points left
        if (phase === TurnPhases.MOVE_PHASE && this.movementPoints) {
            const movementStrategy = this.getMovementStrategy(turn);
            const path = movementStrategy.calculatePath();

            if (!path.length && movementStrategy.isMovementFinished) {
                CommandDispatcher.endAction(this);
            } else {
                this.previousPosition = new Point(this.x, this.y);
                CommandDispatcher.move(this, path);
            }
            return;
        }

        // if there's nothing else to do then end action
        CommandDispatcher.endAction(this);
    }

    getMovementStrategy(turn) {
        const actorPosition = MapUtils.getTilePositionByCoordinates(new Point(this.x, this.y));
        const targetPosition = MapUtils.getTilePositionByCoordinates(new Point(this.target.x, this.target.y));

        if (this.hasSeenTarget || this._isTargetWithinAggroArea(actorPosition, targetPosition)) {
            this.hasSeenTarget = true;
            return new AttackMovementStrategy(this, turn);
        }

        return new WanderMovementStrategy(this, turn);
    }

    _isTargetWithinAggroArea(actorPosition, targetPosition) {
        const aggroDistance = this.aggroDistance;
        const aggroArea = MapUtils.getAreaOfRadius(actorPosition, aggroDistance);
        return MapUtils.isTargetInArea(aggroArea, targetPosition);
    }

    /**
     * Calculates the inital amount of gold for loot
     * @private
     * @return  {number}
     */
    _throwForInitialGold() {
        return this.game.rnd.between(config.minGold, config.maxGold) * this.level;
    }
}