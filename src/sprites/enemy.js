import Actor from 'sprites/actor';
import gameConfig from 'json!assets/config/gameconfig.json';
import Sequence from 'common/sequence';
import AIMovementAction from 'actions/aimovementaction';

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

        this.name = 'MAD KNIGHT';

        this.level = props.level || 1;
        this.health = props.health || config.intialHealth;
        this.gold = this._throwForInitialGold();

        this.attack = props.attack;
        this.defence = props.defence;
        this.movement = props.movement || config.movement;

        this.aggroDistance = props.aggroDistance || config.defaultAggroDistance;

        this.target = props.target;
        this.hasSeenTarget = false;

        this.center();
    }

    getMovementAction(...params) {
        return new AIMovementAction(...params);
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