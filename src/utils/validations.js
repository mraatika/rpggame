import { Sprite } from 'phaser';

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
 * @export
 * Check that given object is contains all functions defined in fnNames list
 * @param {Object} object
 * @param {String[]} fnNames
 * @returns {String|undefined}
 */
export function shouldContainFunctions(object, fnNames = []) {
    for (let i = 0, len = fnNames.length; i < len; i++) {
        const fn = object[fnNames[i]];
        if (typeof fn !== 'function') return 'is invalid';
    }
    return undefined;
}

/**
 * Check if value is a Actor or similar
 * @export
 * @param {any} value
 * @returns {String|undefined}
 */
export function shouldBeActor(value) {
    if (!value) return 'is missing';
    return shouldContainFunctions(value, ['throwAttack', 'throwDefence', 'throwMovement']);
}

/**
 * Check if value is an object with loot and trapdamage methods
 * @export
 * @param {any} value
 * @returns {String|undefined}
 */
export function shouldBeTreasure(value) {
    if (!value) return 'is missing';
    return shouldContainFunctions(value, ['loot', 'trapDamage']);
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
 * Check if value is a sprite and an actor
 * @export
 * @param {any} value
 * @return {String|undefined}
 */
export function shouldBeActorSprite(value) {
    return [shouldBeSprite, shouldBeActor].reduce((error, fn) => error || fn(value), undefined);
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
