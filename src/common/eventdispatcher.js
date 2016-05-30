import {extend} from 'lodash';
import {Signal} from 'phaser';

/**
 * @class EventDispatcher
 * @description A singleton dispatcher for events
 * @extends {Signal}
 * @singleton
 */
class EventDispatcher extends Signal {
    /**
     * @constructor
     * @param       {paramType}
     * @return      {EventDispatcher}
     */
    dispatch(type, params) {
        super.dispatch(extend({type: type }, params));
    }
}

export default new EventDispatcher();