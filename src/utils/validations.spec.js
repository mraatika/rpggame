import { Sprite } from 'phaser';
import validator, * as validators from './validations';

jest.mock('phaser');

describe('Validations', () => {
    describe('validators', () => {
        describe('sprite', () => {
            it('should return undefined if value is valid', () => {
                expect(validators.shouldBeSprite(new Sprite())).toBeFalsy();
            });

            it('should return error message if value is undefined', () => {
                expect(validators.shouldBeSprite()).toContain('is missing');
            });
            it('should return error message if value is not an instance of Sprite', () => {
                expect(validators.shouldBeSprite(() => {})).toContain('is invalid');
            });
        });

        describe('actor', () => {
            it('should return undefined if value is valid', () => {
                const actor = {
                    throwAttack: () => {},
                    throwDefence: () => {},
                    throwMovement: () => {},
                };
                expect(validators.shouldBeActor(actor)).toBeFalsy();
            });

            it('should return error message if value is falsy', () => {
                expect(validators.shouldBeActor()).toContain('is missing');
                expect(validators.shouldBeActor(null)).toContain('is missing');
                expect(validators.shouldBeActor(0)).toContain('is missing');
                expect(validators.shouldBeActor(NaN)).toContain('is missing');
            });

            it('should return error if value is not an object', () => {
                expect(validators.shouldBeActor([])).toContain('is invalid');
                expect(validators.shouldBeActor(() => {})).toContain('is invalid');
            });

            it('should return error message if value does not have throwAttack function', () => {
                const actor = {
                    throwDefence: () => {},
                    throwMovement: () => {},
                };
                expect(validators.shouldBeActor(actor)).toContain('is invalid');
            });

            it('should return error message if value\'s throwAttack is not a function', () => {
                const actor = {
                    throwAttack: 'abc',
                    throwDefence: () => {},
                    throwMovement: () => {},
                };
                expect(validators.shouldBeActor(actor)).toContain('is invalid');
            });

            it('should return error message if value does not have throwDefence function', () => {
                const actor = {
                    throwAttack: () => {},
                    throwMovement: () => {},
                };
                expect(validators.shouldBeActor(actor)).toContain('is invalid');
            });

            it('should return error message if value\'s throwDefence is not a function', () => {
                const actor = {
                    throwAttack: () => {},
                    throwDefence: 'abc',
                    throwMovement: () => {},
                };
                expect(validators.shouldBeActor(actor)).toContain('is invalid');
            });

            it('should return error message if value does not have throwMovement function', () => {
                const actor = {
                    throwAttack: () => {},
                    throwDefence: () => {},
                };
                expect(validators.shouldBeActor(actor)).toContain('is invalid');
            });

            it('should return error message if value\'s throwMovement is not a function', () => {
                const actor = {
                    throwAttack: () => {},
                    throwDefence: () => {},
                    throwMovement: 'abc',
                };
                expect(validators.shouldBeActor(actor)).toContain('is invalid');
            });
        });

        describe('actorsprite', () => {
            it('should return undefined if value is valid', () => {
                const actor = new Sprite();
                actor.throwAttack = () => {};
                actor.throwDefence = () => {};
                actor.throwMovement = () => {};
                expect(validators.shouldBeActorSprite(actor)).toBeFalsy();
            });

            it('should return error message if value is falsy', () => {
                expect(validators.shouldBeActorSprite()).toContain('is missing');
                expect(validators.shouldBeActorSprite(null)).toContain('is missing');
                expect(validators.shouldBeActorSprite(0)).toContain('is missing');
                expect(validators.shouldBeActorSprite(NaN)).toContain('is missing');
            });

            it('should return error if value is not a sprite', () => {
                expect(validators.shouldBeActorSprite({})).toContain('is invalid');
                expect(validators.shouldBeActorSprite([])).toContain('is invalid');
                expect(validators.shouldBeActorSprite(() => {})).toContain('is invalid');
            });

            it('should return error message if value does not have throwAttack function', () => {
                const actor = new Sprite({
                    throwDefence: () => {},
                    throwMovement: () => {},
                });
                expect(validators.shouldBeActorSprite(actor)).toContain('is invalid');
            });

            it('should return error message if value\'s throwAttack is not a function', () => {
                const actor = new Sprite({
                    throwAttack: 'abc',
                    throwDefence: () => {},
                    throwMovement: () => {},
                });
                expect(validators.shouldBeActorSprite(actor)).toContain('is invalid');
            });

            it('should return error message if value does not have throwDefence function', () => {
                const actor = new Sprite({
                    throwAttack: () => {},
                    throwMovement: () => {},
                });
                expect(validators.shouldBeActorSprite(actor)).toContain('is invalid');
            });

            it('should return error message if value\'s throwDefence is not a function', () => {
                const actor = new Sprite({
                    throwAttack: () => {},
                    throwDefence: 'abc',
                    throwMovement: () => {},
                });
                expect(validators.shouldBeActorSprite(actor)).toContain('is invalid');
            });

            it('should return error message if value does not have throwMovement function', () => {
                const actor = new Sprite({
                    throwAttack: () => {},
                    throwDefence: () => {},
                });
                expect(validators.shouldBeActorSprite(actor)).toContain('is invalid');
            });

            it('should return error message if value\'s throwMovement is not a function', () => {
                const actor = new Sprite({
                    throwAttack: () => {},
                    throwDefence: () => {},
                    throwMovement: 'abc',
                });
                expect(validators.shouldBeActorSprite(actor)).toContain('is invalid');
            });
        });

        describe('instanceOf', () => {
            const arrayValidator = validators.shouldBeInstanceOf(Array);

            it('should return undefined if value is valid', () => {
                expect(arrayValidator([])).toBeFalsy();
            });

            it('should return error message if value is undefined', () => {
                expect(arrayValidator()).toContain('is missing');
            });
            it('should return error message if value is not an instance of Sprite', () => {
                expect(arrayValidator({})).toContain('is invalid');
            });
        });
    });
    describe('Validator', () => {
        let validations;

        beforeEach(() => {
            validations = {
                propA: validators.shouldBeInstanceOf(Array),
                propB: validators.shouldBeSprite,
            };
        });

        describe('Validator', () => {
            it('should not throw if subject is valid', () => {
                const subject = { propA: [], propB: new Sprite() };
                expect(() => validator(subject)(validations)).not.toThrow();
            });

            it('should throw if first property is missing', () => {
                const subject = { propA: undefined, propB: new Sprite() };
                expect(() => validator(subject)(validations)).toThrow('propA is missing!');
            });

            it('should throw if second property is invalid', () => {
                const subject = { propA: [], propB: {} };
                expect(() => validator(subject)(validations)).toThrow('propB is invalid!');
            });

            it('should not call validator if it is not a function', () => {
                validations.propC = {};
                const subject = { propA: [], propB: new Sprite(), propC: 'a' };
                expect(() => validator(subject)(validations)).not.toThrow();
            });

            it('should use custom validator function', () => {
                const errorMsg = 'is custom error';
                validations.propC = () => errorMsg;
                const subject = { propA: [], propB: new Sprite(), propC: 'a' };
                expect(() => validator(subject)(validations)).toThrow(`propC ${errorMsg}!`);
            });
        });
    });
});
