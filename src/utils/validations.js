import { Sprite } from 'phaser';
import Actor from '../sprites/actor';

/**
 * Check if value is an instance of given type
 * @export
 * @param {Object} type
 * @returns {Function}
 */
export function shouldBeInstanceOf(type) {
    /**
     * Actual validation function
     * @param {any} value
     * @returns {String|undefined}
     */
    return (value) => {
        if (!value) return 'is missing!';
        if (!(value instanceof type)) return 'is invalid';
        return undefined;
    };
}

/**
 * Check if value is an instance of Actor
 * @export
 * @param {any} value
 * @returns {String|undefined}
 */
export function shouldBeActor(value) {
    return shouldBeInstanceOf(Actor)(value);
}

/**
 * Check if value is an instance of Sprite
 * @export
 * @param {any} value
 * @returns {String|undefined}
 */
export function shouldBeSprite(value) {
    return shouldBeInstanceOf(Sprite)(value);
}

/**
 * Get validator for given subject
 * @export
 * @param {Object} subject
 * @returns {Function}
 */
export default function validator(subject) {
    /**
     * Actual validation function
     * @param {Object} validations
     * @throws Will throw if validation of some property fails
     * @returns {undefined}
     */
    return function validate(validations) {
        Object.keys(validations).forEach((key) => {
            const propValidator = validations[key];
            const value = subject[key];

            if (typeof propValidator === 'function') {
                const error = propValidator(value);

                if (error) {
                    throw new Error(`ValidationError: ${key} ${error}!`);
                }
            }
        });
    };
}
