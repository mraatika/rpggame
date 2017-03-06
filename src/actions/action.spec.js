import createAction from './action';
import ActionTypes from '../constants/actiontypes';

describe('Action', () => {
    describe('Initialization', () => {
        it('should require an action type', () => {
            expect(() => createAction()).toThrow('InvalidArgumentsException: action type is missing!');
        });

        it('should require a correct action type', () => {
            expect(() => createAction('InvalidType')).toThrow('InvalidArgumentsException: action type is invalid!');
        });

        it('should not throw if type is valid', () => {
            expect(() => createAction(ActionTypes.MOVE_ACTION)).not.toThrow();
        });

        it('should not be done', () => {
            const action = createAction(ActionTypes.MOVE_ACTION);
            expect(action.isDone).toBeFalsy();
        });

        it('should not be pending', () => {
            const action = createAction(ActionTypes.MOVE_ACTION);
            expect(action.pending).toBeFalsy();
        });

        it('should have priority of 0', () => {
            const action = createAction(ActionTypes.MOVE_ACTION);
            expect(action.priority).toBe(0);
        });

        it('should have no validations', () => {
            const action = createAction(ActionTypes.MOVE_ACTION);
            expect(action.validations).toBeUndefined();
        });

        it('should assign all props as it\'s own properties', () => {
            const actor = {};
            const path = [];
            const action = createAction(ActionTypes.MOVE_ACTION, {}, { actor, path });

            expect(action.actor).toBe(actor);
            expect(action.path).toBe(path);
        });
    });

    describe('Validation', () => {
        it('should throw if validation of a prop fails', () => {
            const validators = { name: jest.fn().mockReturnValue('is missing') };
            expect(() => createAction(ActionTypes.MOVE_ACTION, validators, { name: null })).toThrow('name is missing!');
        });

        it('should not throw if validations pass', () => {
            const validators = { name: jest.fn() };
            expect(() => createAction(ActionTypes.MOVE_ACTION, validators, { name: 'James Bond' })).not.toThrow();
        });

        it('should not validate if given validation is not a function', () => {
            const validators = { name: jest.fn(), prop: undefined };
            expect(() => createAction(ActionTypes.MOVE_ACTION, validators, { name: 'James Bond', prop: 1 })).not.toThrow();
        });
    });

    describe('Executing an action', () => {
        it('should require subclass to implement the execute method', () => {
            const action = createAction(ActionTypes.MOVE_ACTION);
            expect(() => action.execute()).toThrow('Execute method should be implemented by subclass!');
        });
    });
});
