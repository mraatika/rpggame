import { Point } from 'phaser';
import { isOnSurroundingTile } from '../utils/maputils';
import gameConfig from '../config/gameconfig.json';
import createActor from './actor';
import TurnPhases from '../constants/turnphases';
import Commands from '../commands/commands';
import AttackMovementStrategy from '../movement/attackmovementstrategy';
import StandStillMovementStrategy from '../movement/standstillmovementstrategy';
import WanderMovementStrategy from '../movement/wandermovementstrategy';

/**
 * Movement strategy class-prop mappings
 * @type {Object}
 */
const movements = {
    wandering: WanderMovementStrategy,
    standing: StandStillMovementStrategy,
};

/**
 * Enemy configurations from game config
 * @type {object}
 */
const config = gameConfig.enemy;

function resolveDefaultMovementStrategy(props) {
    return props.defaultMovementStrategy ||
        movements[props.movement_strategy] ||
        StandStillMovementStrategy;
}

/**
 * Create properties and methods that are specific for enemy.
 * @param {Object} [props={}]
 * @returns {Object}
 */
function createOwnProperties(props = {}) {
    return {
        name: props.name,
        health: props.initialHealth || config.initialHealth,
        attack: props.attack,
        defence: props.defence,
        movement: props.movement || config.movement,
        actionPoints: props.actionPoints || config.actionPoints,
        aggroDistance: props.aggroDistance || config.defaultAggroDistance,
        minGold: props.minGold || config.minGold,
        maxGold: props.maxGold || config.maxGold,
        items: props.items || [],
        enemyType: props.enemy_type,
        description: props.description,
        target: props.target,
        hasSeenTarget: false,
        aggroLevel: 0,
        defaultMovementStrategy: resolveDefaultMovementStrategy(props),

        /**
         * Decide an action to take
         * @param {Turn} turn
         * @fires Commands#Command
         */
        decideAction(turn) {
            const isTargetWithinAttackRange = isOnSurroundingTile(this, this.target);
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
                const movementStrategy = this.decideMovementStrategy(turn);
                const path = movementStrategy.calculatePath();

                if (!path.length || movementStrategy.isMovementFinished) {
                    new Commands.EndActionCommand(this).dispatch();
                } else {
                    this.previousPosition = new Point(this.x, this.y);
                    new Commands.MoveCommand(this, path).dispatch();
                }
                return;
            }

            // if there's nothing else to do then end action
            new Commands.EndActionCommand(this).dispatch();
        },

        /**
         * Decide a special movement strategy if needed.
         * If not returns the current movement strategy.
         * @param  {Turn} turn Current turn
         * @return {MovementStrategy}
         */
        decideMovementStrategy(turn) {
            // if target is seen or it's within the aggro area then chase the target
            if (this.aggroLevel > 0) {
                return new AttackMovementStrategy(this, turn);
            }

            const MovementStrategyClass = this.movementStrategy;

            // otherwise use the current strategy
            return new MovementStrategyClass(this, turn);
        },

        /**
         * Update enemy's aggro level
         * @param {Number} aggro
         */
        updateAggroLevel(aggro = 0) {
            if (!Number.isNaN(+aggro)) {
                this.aggroLevel = Math.max(0, aggro + this.aggroLevel);
            }
        },
    };
}

/**
 * @name Enemy
 * Factory function for creating enemies. Enemy is an actor
 * that is hostile to player.
 * @param {Object} [props={}]
 * @extends {Actor}
 * @returns {Enemy}
 */
export default function createEnemy(props = {}) {
    /**
     * Compose the enemy object
     */
    const enemy = Object.assign(
        createActor(),
        createOwnProperties(props),
    );

    /**
     * define getters and setters
     */
    Object.defineProperty(enemy, 'movementStrategy', {
        enumerable: true,
        get() { return this.defaultMovementStrategy; },
        set(strategy = {}) {
            if (typeof strategy.calculatePath !== 'function') {
                throw new Error('Cannot set movement strategy:', strategy, 'is not an instance of MovementStrategy');
            }
            this.defaultMovementStrategy = strategy;
        },
    });

    return enemy;
}
