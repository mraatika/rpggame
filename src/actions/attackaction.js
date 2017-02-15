import ActionTypes from '../constants/actiontypes';
import Action from './action';
import MapUtils from '../utils/maputils';
import Events from '../events/events';

function onActionDone() {
    this.pending = false;
    this.isDone = true;
}

/**
 * @class AttackAction
 * @description A class representing an attack against another actor
 * @extends {Action}
 */
export default class AttackAction extends Action {

     /**
     * Getter for action type
     * @return {Symbol}
     */
    get type() {
        return ActionTypes.ATTACK_ACTION;
    }

    /**
     * @constructor
     * @param       {Command} command
     * @return      {AttackAction}
     */
    constructor(command) {
        super(command);
        this.target = command.target;
    }

    /**
     * Execute this action
     * @return {boolean} Executed successfully?
     */
    execute() {
        const { actor, target } = this;

        if (!MapUtils.isOnSurroundingTile(actor, target)) {
            return false;
        }

        this.pending = true;

        const attack = actor.throwAttack();

        new Events.AttackEvent(actor, target, attack).dispatch();

        if (!attack) {
            target.emitText('miss', onActionDone.bind(this));
            return true;
        }

        const defence = target.throwDefence();

        new Events.DefendEvent(target, defence).dispatch();

        const damage = Math.max(0, attack - defence);

        new Events.DamageEvent(target, damage).dispatch();

        if (damage) {
            target.emitText(-1 * damage, onActionDone.bind(this));
        } else {
            target.emitIcon('shield', onActionDone.bind(this));
        }

        target.damage(damage);

        if (target.health <= 0) {
            new Events.ActorKilledEvent(target).dispatch();
        }

        return true;
    }
}
