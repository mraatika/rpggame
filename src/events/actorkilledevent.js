import GameEvent from 'events/gameevent';
import EventTypes from 'events/eventtypes';

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