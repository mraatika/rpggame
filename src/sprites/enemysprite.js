import { Point } from 'phaser';
import { getTilePositionByCoordinates, getAreaOfRadius, isTargetInArea } from '../utils/maputils';
import gameConfig from '../config/gameconfig.json';

import createEnemy from '../factories/enemy';
import createEmitterSprite from '../factories/emittersprite';
import HealthBar from './healthbar';

import Events from '../events/events';
import EventTypes from '../constants/eventtypes';
import EventDispatcher from '../events/eventdispatcher';

/**
 * Check if target (player) is within the aggro range
 * @param {Actor} actor
 * @param {Actor} target
 * @returns {Boolean}
 */
function isTargetWithinAggroArea(actor, target) {
    const actorPosition = getTilePositionByCoordinates(
        new Point(actor.x, actor.y),
    );
    const targetPosition = getTilePositionByCoordinates(
        new Point(target.x, target.y),
    );
    const aggroDistance = actor.aggroDistance;
    const aggroArea = getAreaOfRadius(actorPosition, aggroDistance);

    return isTargetInArea(aggroArea, targetPosition);
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
 * @name EnemySprite
 * An enemy sprite
 * @extends {Sprite}
 * @extends {EmitterSprite}
 * @extends {Enemy}
 */
export default function createEnemySprite(game, x = 0, y = 0, props = {}) {
    const sprite = game.make.sprite(x, y, 'actors', props.frame);
    const enemySprite = Object.assign(
        sprite,
        createEmitterSprite(game, sprite),
        createEnemy(props),
        {
            /**
             * Damage this actor
             * @param  {number} damage The amount of damage
             */
            damage(damage) {
                this.health -= damage;
                this.healthBar.animateUpdate(this.health);
                if (this.health <= 0) this.destroy();
            },
        },
    );

    const healthBar = new HealthBar(game, sprite.height, enemySprite.health).draw();
    enemySprite.addChild(healthBar);
    enemySprite.healthBar = healthBar;

    enemySprite.anchor.set(0.5);

    // start listening to game events
    EventDispatcher.add(handleEvent, enemySprite);
    // remove event handler when sprite is destroyed
    sprite.events.onDestroy.add(() => EventDispatcher.remove(handleEvent, enemySprite));

    return enemySprite;
}

/**
 * @exports
 * Create an enemy sprite from a tilemap object
 * @param {Phaser.Game} game
 * @param {Player} player
 * @param {Object} obj
 * @returns {EnemySprite}
 */
export function fromMapObject(game, player, obj) {
    const centerPoint = gameConfig.map.tileSize / 2;
    const props = Object.assign(
        {},
        // propeties all enemies share
        gameConfig.enemy,
        // properties all enemies of same type share
        gameConfig.enemyTypes[obj.properties.enemyType],
        // properties from tilemap object
        obj.properties,
        {
            target: player,
        },
    );

    return createEnemySprite(game, obj.x - centerPoint, obj.y + centerPoint, props);
}
