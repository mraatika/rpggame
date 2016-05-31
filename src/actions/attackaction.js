import ActionTypes from 'actions/actiontypes';
import Action from 'actions/action';
import MapUtils from 'common/maputils';
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

        const attack = actor.throwAttack();

        console.log(`${actor.name} attacks target with ${attack}`);

        if (!attack) {
            this.isDone = true;
            return true;
        }

        const defence = target.throwDefence();

        console.log(`${target.name} defends with ${defence}`);

        const damage = Math.max(0, attack - defence);

        console.log(`${target.name} took ${damage} damage`);

        this.pending = true;

        if (damage) {
            target.emitText(-1 * damage, this._animationDone.bind(this));
        } else {
            target.emitIcon('shield', this._animationDone.bind(this));
        }

        target.damage(damage);

        return true;
    }

    _animationDone() {
        this.pending = false;
        this.isDone = true;
    }
}