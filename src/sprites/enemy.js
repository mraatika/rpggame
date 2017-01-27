import {Easing, Point, Rectangle} from 'phaser';
import gameConfig from 'json!assets/config/gameconfig.json';
import Actor from 'sprites/actor';
import MapUtils from 'common/maputils';
import Sequence from 'common/sequence';
import TurnPhases from 'common/turnphases';
import MovementStrategy from 'movement/movementstrategy';
import AttackMovementStrategy from 'movement/attackmovementstrategy';
import StandStillMovementStrategy from 'movement/standstillmovementstrategy';
import Commands from 'commands/commands';
import Events from 'events/events';
import EventDispatcher from 'events/eventdispatcher';
import EventTypes from 'events/eventtypes';

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

        this._createHealthBar();

        EventDispatcher.add(this._handleEvent, this);
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
        this._updateHealthBar();
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

        // otherwise use the current strategy
        return new this.movementStrategy(this, turn);
    }

    /**
     * Check if target (player) is within the aggro range
     * @private
     * @return  {Boolean}
     */
    _isTargetWithinAggroArea() {
        const actorPosition = MapUtils.getTilePositionByCoordinates(new Point(this.x, this.y));
        const targetPosition = MapUtils.getTilePositionByCoordinates(new Point(this.target.x, this.target.y));
        const aggroDistance = this.aggroDistance;
        const aggroArea = MapUtils.getAreaOfRadius(actorPosition, aggroDistance);

        return MapUtils.isTargetInArea(aggroArea, targetPosition);
    }

    /**
     * Callback for event dispatcher.
     * @private
     * @param   {GameEvent} event
     */
    _handleEvent(event) {
        // if enemy hasn't yet spotted the player then check if he/she has moved within the aggro range
        if (event.type === EventTypes.MOVE_EVENT && event.actor.isPlayerControlled) {
            if (this._isTargetWithinAggroArea()) {
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
     * Create health bar above this sprite
     * @private
     */
    _createHealthBar() {
        const lifeBarHeight = 10;
        const lifeBarWidth = this.lifeBarWidth = 40;

        // the background
        const bgBmd = this.game.add.bitmapData(lifeBarWidth, lifeBarHeight);
        bgBmd.ctx.beginPath();
        bgBmd.ctx.rect(0, 0, lifeBarWidth, lifeBarHeight);
        bgBmd.ctx.fillStyle = '#00685e';
        bgBmd.ctx.fill();

        const e = this.game.make.graphics(lifeBarWidth - this.width / 2 - 6, -(this.height / 2) - lifeBarHeight - 5);
        e.beginFill(0x00685E);
        e.lineStyle(2, 0x00F910);
        e.drawCircle(0, 0, 20, 20);

        const health = this.game.make.text(e.x - 3, e.y - 6.5, this.health, { font: 'bold 12px Arial', fill: '#ffffff' });

        // background sprite
        const bglife = this.game.make.sprite(0, 0 - this.height, bgBmd);
        bglife.anchor.set(0.5);

        // life bar
        const lifeBmd = this.game.add.bitmapData(lifeBarWidth, lifeBarHeight);
        lifeBmd.ctx.beginPath();
        lifeBmd.ctx.rect(0, 0, lifeBarWidth, lifeBarHeight);
        lifeBmd.ctx.fillStyle = '#00f910';
        lifeBmd.ctx.fill();

        // life bar sprite
        this.life = this.game.make.sprite(-31, 0 - this.height - lifeBarHeight / 2, lifeBmd);

        this.addChild(bglife);
        this.addChild(this.life);
        this.addChild(e);
        this.addChild(health);
    }

    /**
     * Reduce health bar width to display current health
     * @private
     */
    _updateHealthBar() {
        const step = this.lifeBarWidth / this.initialHealth;

        this.game.add.tween(this.life)
            .to({ width: this.health * step }, 200, Easing.Linear.None, true);
    }
}