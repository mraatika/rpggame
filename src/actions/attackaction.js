import ActionTypes from 'actions/actiontypes';
import Action from 'actions/action';
import MapUtils from 'common/maputils';
import Events from 'events/events';

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
        const {actor, target} = this;

        if (!MapUtils.isOnSurroundingTile(actor, target)) {
            return false;
        }

        target.events.onKilled.add(this._onActorDeath, this);

        const attack = actor.throwAttack();

        new Events.AttackEvent(actor, target, attack).dispatch();

        if (!attack) {
            target.emitText('miss');
            this.isDone = true;
            return true;
        }

        const defence = target.throwDefence();

        new Events.DefendEvent(target, defence).dispatch();

        const damage = Math.max(0, attack - defence);

        new Events.DamageEvent(target, damage).dispatch();

        this.pending = true;

        if (damage) {
            target.emitText(-1 * damage, this._animationDone.bind(this));
        } else {
            target.emitIcon('shield', this._animationDone.bind(this));
        }

        target.damage(damage);

        target.events.onKilled.remove(this._onActorDeath, this);

        return true;
    }

    _animationDone() {
        this.pending = false;
        this.isDone = true;
    }

    _onActorDeath(actor) {
        console.log('ACTOR KILLED, DISPATCHING AN EVENT!');
        new Events.ActorKilledEvent(actor).dispatch();
    }
}