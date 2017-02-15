import GameEvent from './gameevent';
import EventTypes from '../constants/eventtypes';

/**
 * @class ActorKilledEvent
 * @description An event of an actor getting killed
 * @extends {GameEvent}
 */
export default class ActorKilledEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @return      {ActorKilledEvent}
     */
    constructor(actor) {
        super(EventTypes.ACTOR_KILLED_EVENT, { actor });
    }
}
