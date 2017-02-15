import { Sprite } from 'phaser';
import Actor from '../sprites/actor';
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
                expect(validators.shouldBeActor(new Actor())).toBeFalsy();
            });

            it('should return error message if value is undefined', () => {
                expect(validators.shouldBeActor()).toContain('is missing');
            });
            it('should return error message if value is not an instance of Sprite', () => {
                expect(validators.shouldBeActor(() => {})).toContain('is invalid');
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
