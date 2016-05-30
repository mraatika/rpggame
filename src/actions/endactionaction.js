import Action from 'actions/action';
import ActionTypes from 'actions/actiontypes';

export default class EndActionAction extends Action {

    get type() {
        return ActionTypes.END_ACTION_ACTION;
    }

    execute() {
        this.isDone = true;
        return true;
    }
}