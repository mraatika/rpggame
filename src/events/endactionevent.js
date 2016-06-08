import GameEvent from 'events/gameevent';
import EventTypes from 'events/eventtypes';

/**
 * @class EndActionEvent
 * @description An event of an actor ending a turn phase
 * @extends {GameEvent}
 */
export default class EndActionEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {TurnPhase} phase
     * @return      {EndActionEvent}
     */
    constructor(actor, phase) {
        super(EventTypes.END_ACTION_EVENT, { actor, phase });
    }
}