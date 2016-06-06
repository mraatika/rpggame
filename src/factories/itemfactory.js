import Item from 'sprites/item';
import gameConfig from 'json!assets/config/gameconfig.json';

export default class ItemFactory {

    constructor(game) {
        this.game = game;
    }

    create(objId) {
        const centerPoint = gameConfig.map.tileSize / 2;
        const itemProps = gameConfig.items[objId];
        const itemSprite = new Item(this.game.game, centerPoint, centerPoint, itemProps);

        itemSprite.center();

        return itemSprite;
    }
}