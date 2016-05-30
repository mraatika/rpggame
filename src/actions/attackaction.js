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
        this.attacker = this.actor;
        this.defender = this.attacker.target;
    }

    execute() {
        const {attacker, defender} = this;

        if (!MapUtils.isOnSurroundingTile(attacker, defender)) {
            return false;
        }

        const attack = attacker.throwAttack();

        console.log(`${attacker.name} attacks target with ${attack}`);

        if (!attack) {
            this.isDone = true;
            return true;
        }

        const defence = defender.throwDefence();

        console.log(`${defender.name} defends with ${defence}`);

        const damage = Math.max(0, attack - defence);

        console.log(`${defender.name} took ${damage} damage`);

        defender.damage(damage);

        if (defender.health <= 0) {
            defender.kill();
        }

        this.isDone = true;

        return true;
    }
}