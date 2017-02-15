import Action from './action';
import ActionTypes from '../constants/actiontypes';

describe('Action', () => {
    describe('Initialization', () => {
        it('should require an action type', () => {
            expect(() => new Action()).toThrow('InvalidArgumentsException: action type is missing!');
        });

        it('should require a correct action type', () => {
            expect(() => new Action('InvalidType')).toThrow('InvalidArgumentsException: action type is invalid!');
        });

        it('should not throw if type is valid', () => {
            expect(() => new Action(ActionTypes.MOVE_ACTION)).not.toThrow();
        });

        it('should not be done', () => {
            const action = new Action(ActionTypes.MOVE_ACTION);
            expect(action.isDone).toBeFalsy();
        });

        it('should not be pending', () => {
            const action = new Action(ActionTypes.MOVE_ACTION);
            expect(action.pending).toBeFalsy();
        });

        it('should have priority of 0', () => {
            const action = new Action(ActionTypes.MOVE_ACTION);
            expect(action.priority).toBe(0);
        });

        it('should have no validations', () => {
            const action = new Action(ActionTypes.MOVE_ACTION);
            const validations = Object.keys(action.validations);
            expect(validations.length).toBe(0);
        });

        it('should assign all props as it\'s own properties', () => {
            const actor = {};
            const path = [];
            const action = new Action(ActionTypes.MOVE_ACTION, { actor, path });

            expect(action.actor).toBe(actor);
            expect(action.path).toBe(path);
        });
    });

    describe('Validation', () => {
        const nameValidator = jest.fn();
        const validators = {
            name: nameValidator,
        };

        class ActionSubclass extends Action {
            get validations() {
                return validators;
            }
        }
        it('should throw if validation of a prop fails', () => {
            nameValidator.mockReturnValueOnce('is missing');
            expect(() => new ActionSubclass(ActionTypes.MOVE_ACTION, { name: null })).toThrow('name is missing!');
        });

        it('should not throw if validations pass', () => {
            nameValidator.mockReturnValueOnce(undefined);
            expect(() => new ActionSubclass(ActionTypes.MOVE_ACTION, { name: 'James Bond' })).not.toThrow('name is missing!');
        });

        it('should not validate if given validation is not a function', () => {
            validators.prop = {};
            expect(() => new ActionSubclass(ActionTypes.MOVE_ACTION, { name: 'James Bond', prop: 1 })).not.toThrow();
        });
    });

    describe('Executing an action', () => {
        it('should require subclass to implement the execute method', () => {
            const action = new Action(ActionTypes.MOVE_ACTION);
            expect(() => action.execute()).toThrow('Execute method should be implemented by subclass!');
        });
    });
});
