import ActionTypes from '../constants/actiontypes';
import Action from './action';
import { isOnSurroundingTile } from '../utils/maputils';
import EventTypes from '../constants/eventtypes';
import { sendEvent } from '../events/eventdispatcher';
import { shouldBeActorSprite } from '../utils/validations';

function onActionDone() {
    this.pending = false;
    this.isDone = true;
}

/**
 * @export
 * @class AttackAction
 * @description A class representing an attack against another actor
 * @extends {Action}
 */
export default class AttackAction extends Action {
    /**
     * @readonly
     * @memberOf AttackAction
     */
    get validations() {
        return {
            actor: shouldBeActorSprite,
            target: shouldBeActorSprite,
        };
    }

    /**
     * Creates an instance of AttackAction.
     * @param {Command} command
     * @memberOf AttackAction
     */
    constructor(command) {
        const { actor, target } = command;
        super(ActionTypes.ATTACK_ACTION, { actor, target });
    }

    /**
     * Execute this action.
     * @return {Boolean} Executed successfully?
     * @memberOf AttackAction
     */
    execute() {
        const { actor, target } = this;

        if (!isOnSurroundingTile(actor, target)) {
            return false;
        }

        this.pending = true;

        const attack = actor.throwAttack();

        sendEvent(EventTypes.ATTACK_EVENT, { actor, target, attack });

        if (!attack) {
            target.emitText('miss', onActionDone.bind(this));
            return true;
        }

        const defence = target.throwDefence();

        sendEvent(EventTypes.DEFEND_EVENT, { actor: target, defence });

        const damage = Math.max(0, attack - defence);

        sendEvent(EventTypes.DAMAGE_EVENT, { actor: target, damage });

        if (damage) {
            target.emitText(-1 * damage, onActionDone.bind(this));
        } else {
            target.emitIcon('shield', onActionDone.bind(this));
        }

        target.damage(damage);

        if (target.health <= 0) {
            sendEvent(EventTypes.ACTOR_KILLED_EVENT, { actor: target });
        }

        return true;
    }
}
