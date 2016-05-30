import ActionTypes from 'actions/actiontypes';
import Action from 'actions/action';
import MapUtils from 'common/maputils';
/**
 * @class AttackAction
 * @description A class representing an attack against another actor
 * @extends {Action}
 */
export default class AttackAction extends Action {

    get type() {
        return ActionTypes.ATTACK_ACTION;
    }

    constructor(command) {
        super(command);
        this.target = this.actor.target;
    }

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

        target.damage(damage);

        if (target.health <= 0) {
            target.kill();
        }

        this.isDone = true;

        return true;
    }
}