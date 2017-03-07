import { Point } from 'phaser';
import { getTilePositionByCoordinates, getSurroundingTiles, isWalkable } from '../utils/maputils';

/**
 * @name AttackMovementStrategy
 * Attack movement strategy for NPC character
 * @exports
 * @extends {MovementStrategy}
 * @param {ActorSprite} actor
 * @param {Turn} turn
 * @returns {AttackMovementStrategy}
 */
export default function attackMovementStrategy(actor, turn) {
    const { map, game, actors } = turn.state;
    const allActors = actors.children;
    let isMovementFinished = false;

    /**
     * Select closest position that actor can attack target from
     * @private
     * @param {Phaser.Point} actorPosition
     * @param {Phaser.Point} targetPosition
     * @returns {Phaser.Point}
     */
    function selectClosestAttackingPosition(actorPosition, targetPosition) {
        const surroundingTiles = getSurroundingTiles(targetPosition);
        const nonEmptyTiles = surroundingTiles
            .filter(tile => !!tile);
        const walkable = nonEmptyTiles
            .filter(tile => isWalkable(map, tile, allActors));

        return walkable.reduce((memo, tile) => {
            const memoDistance = game.physics.arcade.distanceBetween(actorPosition, memo);
            const distance = game.physics.arcade.distanceBetween(actorPosition, tile);
            return memoDistance < distance ? memo : tile;
        }, walkable[0]);
    }

    /**
     * AttackMovementStrategy's public methods
     */
    const methods = {
        isMovementFinished: () => isMovementFinished,

        calculatePath() {
            const actorPosition = getTilePositionByCoordinates(
                new Point(actor.x, actor.y),
            );
            const targetPosition = getTilePositionByCoordinates(
                new Point(actor.target.x, actor.target.y),
            );
            const endPoint = selectClosestAttackingPosition(actorPosition, targetPosition);
            let path = [];

            if (!endPoint) {
                isMovementFinished = true;
                return [];
            }

            // endpoint is false if it's occupied or the tile is a blocking tile
            game.pathFinder.findPath(actorPosition, endPoint, (_path) => {
                // move as far as possible
                path = (_path || []).slice(0, 2);
            });

            return path;
        },
    };

    return Object.assign({}, methods);
}
