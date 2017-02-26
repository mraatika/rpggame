import Item from '../sprites/item';
import gameConfig from '../config/gameconfig.json';

/**
 * @exports
 * @class ItemFactory
 * @description A factory class for creating items
 */
export default class ItemFactory {
    /**
     * Create an item
     * @param  {string} objId An id for locating item properties from config file
     * @returns {Item}
     */
    create(objId) {
        const itemProps = Object.assign({}, gameConfig.items[objId], { id: objId });
        return new Item(itemProps);
    }
}
