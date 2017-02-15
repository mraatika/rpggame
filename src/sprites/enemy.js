import { Point } from 'phaser';
import gameConfig from '../config/gameconfig.json';
import Actor from './actor';
import MapUtils from '../utils/maputils';
import Sequence from '../utils/sequence';
import TurnPhases from '../constants/turnphases';
import MovementStrategy from '../movement/movementstrategy';
import AttackMovementStrategy from '../movement/attackmovementstrategy';
import StandStillMovementStrategy from '../movement/standstillmovementstrategy';
import Commands from '../commands/commands';
import Events from '../events/events';
import EventDispatcher from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import HealthBar from './healthbar';

/**
 * Enemy configurations from game config
 * @type {object}
 */
const config = gameConfig.enemy;

/**
 * Check if target (player) is within the aggro range
 * @param {Actor} actor
 * @param {Actor} target
 * @returns {Boolean}
 */
function isTargetWithinAggroArea(actor, target) {
    const actorPosition = MapUtils.getTilePositionByCoordinates(
        new Point(actor.x, actor.y),
    );
    const targetPosition = MapUtils.getTilePositionByCoordinates(
        new Point(target.x, target.y),
    );
    const aggroDistance = actor.aggroDistance;
    const aggroArea = MapUtils.getAreaOfRadius(actorPosition, aggroDistance);

    return MapUtils.isTargetInArea(aggroArea, targetPosition);
}

/**
 * Callback for event dispatcher.
 * @private
 * @param   {GameEvent} event
 */
function handleEvent(event) {
    // if enemy hasn't yet spotted the player then check
    // if he/she has moved within the aggro range
    if (event.type === EventTypes.MOVE_EVENT && event.actor.isPlayerControlled) {
        if (isTargetWithinAggroArea(this, this.target)) {
            if (!this.hasSeenTarget) {
                new Events.LogEvent(`${this.target.name} was spotted by ${this.name}!`).dispatch();
                this.hasSeenTarget = true;
                this.updateAggroLevel(3);
            }
        } else {
            this.hasSeenTarget = false;
        }
    }
}

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
     * @returns     {Enemy}
     */
    constructor(game, x, y, props = {}) {
        super(game, x, y, 'actors', props.frame);

        this.id = Sequence.next();

        this.name = props.name;

        this.level = props.level || 1;

        this.initialHealth = props.initialHealth || config.initialHealth;
        this.health = this.initialHealth;

        this.attack = props.attack;
        this.defence = props.defence;
        this.movement = props.movement || config.movement;
        this.actionPoints = config.actionPoints;
        this.aggroDistance = props.aggroDistance || config.defaultAggroDistance;
        this.minGold = props.minGold;
        this.maxGold = props.maxGold;
        this.items = props.items;
        this.enemyType = props.enemy_type;
        this.description = props.description;
        this.frame = props.frame;

        this.defaultMovementStrategy = StandStillMovementStrategy;

        this.target = props.target;
        this.hasSeenTarget = false;
        this.aggroLevel = 0;

        this.healthbar = new HealthBar(game, this.height, this.health).draw();
        this.addChild(this.healthbar);

        EventDispatcher.add(handleEvent, this);
    }

    updateAggroLevel(aggro) {
        this.aggroLevel += (+aggro || 0);
        if (this.aggroLevel < 0) this.aggroLevel = 0;
    }

    /**
     * Damage this actor
     * @param  {number} damage The amount of damage
     */
    damage(damage) {
        // use Sprite's damage method
        super.damage(damage);
        // update health bar
        this.healthbar.animateUpdate(this.health);
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
                this.previousPosition = new Point(this.x, this.y);
                new Commands.MoveCommand(this, path).dispatch();
            }
            return;
        }

        // if there's nothing else to do then end action
        new Commands.EndActionCommand(this).dispatch();
    }

    /**
     * Select a special movement strategy if needed. If not returns the current movement strategy.
     * @param  {Turn} turn Current turn
     * @return {MovementStrategy}
     */
    getMovementStrategy(turn) {
        // if target is seen or it's within the aggro area then chase the target
        if (this.aggroLevel > 0) {
            return new AttackMovementStrategy(this, turn);
        }

        const MovementStrategyClass = this.movementStrategy;

        // otherwise use the current strategy
        return new MovementStrategyClass(this, turn);
    }
}
