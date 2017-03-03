import createPlayer from './player';
import gameConfig from '../config/gameconfig.json';

describe('Player', () => {
    describe('Initializing', () => {
        it('should have actor\'s basic methods', () => {
            const player = createPlayer();

            expect(player.throwAttack).toBeInstanceOf(Function);
            expect(player.throwDefence).toBeInstanceOf(Function);
            expect(player.throwMovement).toBeInstanceOf(Function);
        });

        it('should have initial action points', () => {
            const player = createPlayer();
            expect(player.initialActionPoints).toBe(gameConfig.player.initialActionPoints);
        });

        it('should have a purse', () => {
            const player = createPlayer();
            expect(player.purse.getEquippedItems).toBeInstanceOf(Function);
        });

        it('should have initial health', () => {
            const player = createPlayer({});
            expect(player.health).toBe(gameConfig.player.initialHealth);
        });

        it('should have a default name if none give', () => {
            const player = createPlayer({});
            expect(player.name).toBe(gameConfig.player.name);
        });

        it('should be marked as player controlled', () => {
            const player = createPlayer({});
            expect(player.isPlayerControlled).toBe(true);
        });

        it('should take name in the props object', () => {
            const props = { name: 'KILLER QUEEN' };
            const player = createPlayer(props);
            expect(player.name).toBe(props.name);
        });
    });

    describe('Calculating attack', () => {
        it('should have initial attack value', () => {
            const player = createPlayer();
            expect(player.attack).toBe(gameConfig.player.initialAttack);
        });

        it('should add attack modifiers from equipment', () => {
            const player = createPlayer();

            player.purse.getEquippedItems = jest.fn().mockReturnValue([
                { attackModifier: 1 },
                { attackModifier: 2 },
            ]);

            expect(player.attack).toBe(gameConfig.player.initialAttack + 3);
        });
    });

    describe('Calculating defence', () => {
        it('should have initial defence value', () => {
            const player = createPlayer();
            expect(player.defence).toBe(gameConfig.player.initialDefence);
        });

        it('should add attack modifiers from equipment', () => {
            const player = createPlayer();

            player.purse.getEquippedItems = jest.fn().mockReturnValue([
                { defenceModifier: 2 },
                { defenceModifier: 3 },
            ]);

            expect(player.defence).toBe(gameConfig.player.initialDefence + 5);
        });
    });

    describe('Calculating movement', () => {
        it('should have initial movement value', () => {
            const player = createPlayer();
            expect(player.movement).toBe(gameConfig.player.initialMovement);
        });

        it('should add attack modifiers from equipment', () => {
            const player = createPlayer();
            player.purse.getEquippedItems = jest.fn().mockReturnValue([
                { movementModifier: -3 },
            ]);

            expect(player.movement).toBe(gameConfig.player.initialMovement + -3);
        });
    });

    describe('Calculating action points', () => {
        it('should have initial action points value', () => {
            const player = createPlayer();
            expect(player.actionPoints).toBe(gameConfig.player.initialActionPoints);
        });

        it('should add attack modifiers from equipment', () => {
            const player = createPlayer();
            player.purse.getEquippedItems = jest.fn().mockReturnValue([
                { actionPointModifier: 2 },
            ]);

            expect(player.actionPoints).toBe(gameConfig.player.initialActionPoints + 2);
        });
    });
});
