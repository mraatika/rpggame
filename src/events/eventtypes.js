/**
 * Event types
 * @type {enum}
 */
export default {
    'MOVE_EVENT': Symbol('MOVE_EVENT'),
    'ATTACK_EVENT': Symbol('ATTACK_EVENT'),
    'DEFEND_EVENT': Symbol('DEFEND_EVENT'),
    'LOG_EVENT': Symbol('LOG_EVENT'),
    'LOOT_EVENT': Symbol('LOOT_EVENT'),
    'END_ACTION_EVENT': Symbol('END_ACTION_EVENT'),
    'ATTRIBUTE_CHANGE_EVENT': Symbol('ATTRIBUTE_CHANGE_EVENT'),
    'ACTOR_KILLED_EVENT': Symbol('ACTOR_KILLED_EVENT'),
    'START_TURN_EVENT': Symbol('START_TURN_EVENT'),
    'END_TURN_EVENT': Symbol('END_TURN_EVENT'),
    'DAMAGE_EVENT': Symbol('DAMAGE_EVENT')
};