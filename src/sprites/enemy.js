import {Point} from 'phaser';
import gameConfig from 'json!assets/config/gameconfig.json';
import Actor from 'sprites/actor';
import MapUtils from 'common/maputils';
import Sequence from 'common/sequence';
import TurnPhases from 'common/turnphases';
import MovementStrategy from 'movement/movementstrategy';
import AttackMovementStrategy from 'movement/attackmovementstrategy';
import StandStillMovementStrategy from 'movement/standstillmovementstrategy';
import Commands from 'commands/commands';

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

    get movementStrategy() {
        return this.defaultMovementStrategy;
    }

    set movementStrategy(strategy) {
        if (strategy && !(strategy.prototype instanceof MovementStrategy)) {
            throw new Error('Cannot set movement strategy:', strategy, 'is not an instance of MovementStrategy');
        }

        this.defaultMovementStrategy = strategy;
    }

    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {Enemy}
     */
    constructor(game, x, y, props = {}) {
        super(game, x, y, 'actors', props.frame);

        this.id = Sequence.next();

        this.name = props.name;

        this.level = props.level || 1;
        this.health = props.initialHealth || config.initialHealth;

        this.attack = props.attack;
        this.defence = props.defence;
        this.movement = props.movement || config.movement;
        this.actionPoints = config.actionPoints;
        this.aggroDistance = props.aggroDistance || config.defaultAggroDistance;
        this.minGold = props.minGold;
        this.maxGold = props.maxGold;
        this.items = props.items;

        this.defaultMovementStrategy = StandStillMovementStrategy;

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
                new Commands.AttackCommand(this, this.target).dispatch();
            // if turn's phase is move phase then skip movement
            } else if (phase === TurnPhases.MOVE_PHASE) {
                new Commands.EndActionCommand(this).dispatch();
            }
            return;
        }

        // if current phase is move phase and the actor still has movement points left
        if (phase === TurnPhases.MOVE_PHASE && this.movementPoints) {
            const movementStrategy = this.getMovementStrategy(turn);
            const path = movementStrategy.calculatePath();

            if (!path.length && movementStrategy.isMovementFinished) {
                new Commands.EndActionCommand(this).dispatch();
            } else {
                this._previousPosition = new Point(this.x, this.y);
                new Commands.MoveCommand(this, path).dispatch();
            }
            return;
        }

        // if there's nothing else to do then end action
        new Commands.EndActionCommand(this).dispatch();
    }

    getMovementStrategy(turn) {
        const actorPosition = MapUtils.getTilePositionByCoordinates(new Point(this.x, this.y));
        const targetPosition = MapUtils.getTilePositionByCoordinates(new Point(this.target.x, this.target.y));

        if (this.hasSeenTarget || this._isTargetWithinAggroArea(actorPosition, targetPosition)) {
            this.hasSeenTarget = true;
            return new AttackMovementStrategy(this, turn);
        }

        return new this.movementStrategy(this, turn);
    }

    _isTargetWithinAggroArea(actorPosition, targetPosition) {
        const aggroDistance = this.aggroDistance;
        const aggroArea = MapUtils.getAreaOfRadius(actorPosition, aggroDistance);
        return MapUtils.isTargetInArea(aggroArea, targetPosition);
    }
}