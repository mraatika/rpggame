/**
 * @name StandStillMovementStrategy
 * Movement strategy that does nothing but ends movement
 * @exports
 * @extends {MovementStrategy}
 */
export default function standStillMovementStrategy() {
    return { isMovementFinished: () => true, calculatePath: () => [] };
}
