import {Point} from 'phaser';
import Actor from 'sprites/actor';
import {some} from 'lodash';
import gameConfig from 'json!assets/config/gameconfig.json';
import Sequence from 'common/sequence';
import MapUtils from 'common/maputils';
import WanderMovementStrategy from 'movement/wandermovementstrategy';
import AttackMovementStrategy from 'movement/attackmovementstrategy';

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

        this.level = props.level || 1;
        this.health = props.health || config.intialHealth;
        this.gold = this._throwForInitialGold();

        this.attack = props.attack;
        this.defence = props.defence;
        this.movement = props.movement || config.movement;

        this.aggroDistance = props.aggroDistance || config.defaultAggroDistance;

        this.target = props.target;

        this.center();
    }

    getMovementStrategy(allActors) {
        const enemyTilePosition = MapUtils.getTilePositionByCoordinates(new Point(this.x, this.y));

        const aggroArea = MapUtils.getArea(
            enemyTilePosition.x - this.aggroDistance,
            enemyTilePosition.y - this.aggroDistance,
            enemyTilePosition.x + this.aggroDistance,
            enemyTilePosition.y + this.aggroDistance
        );

        const isPlayerWithinAggroArea = some(aggroArea, tile => {
            return some(allActors, actor => {
                if (actor !== this.target) return false;
                const actorTilePosition = MapUtils.getTilePositionByCoordinates(new Point(actor.x, actor.y));
                return MapUtils.isSameTile(actorTilePosition, tile);
            });
        });

        if (isPlayerWithinAggroArea) {
            return turn => {
                return new AttackMovementStrategy(turn, this.target);
            };
        } else {
            return turn => {
                return new WanderMovementStrategy(turn);
            };
        }
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