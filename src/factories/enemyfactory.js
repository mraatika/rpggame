import { omit } from 'lodash';
import Enemy from '../sprites/enemy';
import WanderMovementStrategy from '../movement/wandermovementstrategy';
import StandStillMovementStrategy from '../movement/standstillmovementstrategy';
import gameConfig from '../config/gameconfig.json';

const movements = {
    wandering: WanderMovementStrategy,
    standing: StandStillMovementStrategy,
};

export default class EnemyFactory {
    constructor(state) {
        this.state = state;
    }

    create(obj) {
        const centerPoint = gameConfig.map.tileSize / 2;
        const movementStrategy = obj.properties.movement_strategy;
        const defaultProps = gameConfig.enemy;
        const typeProps = gameConfig.enemy_types[obj.properties.enemy_type];
        const personalProps = omit(obj.properties, ['movement_strategy']);

        const props = Object.assign({}, defaultProps, typeProps, personalProps);
        const enemy = new Enemy(this.state.game, obj.x + centerPoint, obj.y + centerPoint, props);

        enemy.target = this.state.player;

        enemy.center();

        if (movementStrategy && movementStrategy !== 'standing') {
            if (!movements[movementStrategy]) {
                throw new Error('Trying to add unknown move strategy!');
            }
            enemy.movementStrategy = movements[movementStrategy];
        }

        return enemy;
    }
}
