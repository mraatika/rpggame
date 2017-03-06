import ActionTypes from '../constants/actiontypes';
import action from './action';
import { isOnSurroundingTile } from '../utils/maputils';
import EventTypes from '../constants/eventtypes';
import { sendEvent } from '../events/eventdispatcher';
import { shouldBeActorSprite } from '../utils/validations';

/**
 * @export
 * @name AttackAction
 * @extends {Action}
 * Factory function for creating an action of attack against another actor
 * @param {Object} command
 * @returns {AttackAction}
 */
export default function attackAction(command = {}) {
    const { actor, target } = command;

    const validations = {
        actor: shouldBeActorSprite,
        target: shouldBeActorSprite,
    };

    function onActionDone() {
        this.pending = false;
        this.isDone = true;
    }

    const methods = {
        /**
         * Execute this action.
         * @return {Boolean} Executed successfully?
         * @memberOf AttackAction
         */
        execute() {
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
        },
    };

    return Object.assign(
        action(ActionTypes.ATTACK_ACTION, validations, { actor, target }),
        methods,
    );
}
