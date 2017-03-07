import { getTilePositionByCoordinates, isWalkable, getAreaOfRadius } from '../utils/maputils';

/**
 * @name WanderMovementStrategy
 * Random movement strategy for NPC character
 * @extends {MovementStrategy}
 * @exports
 * @param {EnemySprite} enemy
 * @param {Turn} turn
 * @returns {Function}
 */
export default function wanderMovementStrategy(actor, turn) {
    const { map, game, actors } = turn.state;
    const allActors = actors.children;
    let isMovementFinished = false;

    /**
     * Select a random surrounding tile to move to which is not actors previous position
     * @private
     * @param   {Phaser.Point} actorPosition
     * @return  {Phaser.Point}
     * @memberOf WanderMovementStrategy
     */
    function selectRandomPoint(actorPosition) {
        const maxDistance = actor.movementPoints;
        const area = getAreaOfRadius(actorPosition, maxDistance);
        const walkables = area.filter(tile => isWalkable(map, tile, allActors));

        return walkables.length ? game.rnd.pick(walkables) : null;
    }

    const publicProps = {
        isMovementFinished: false,
    };

    /**
     * Select random point to wander to
     * @private
     * @param   {number} maxDistance
     * @return  {undefined}
     */
    const methods = {
        isMovementFinished() {
            return isMovementFinished;
        },

        calculatePath() {
            const actorPosition = getTilePositionByCoordinates(actor.position);
            const endPoint = selectRandomPoint(actorPosition);
            let path = [];

            if (!endPoint) {
                isMovementFinished = true;
                return [];
            }

            game.pathFinder.findPath(actorPosition, endPoint, (calculatedPath = []) => {
                // move as far as possible
                path = calculatedPath.slice(0, actor.movementPoints + 1);
            });

            return path;
        },
    };

    return Object.assign({}, publicProps, methods);
}
