import createItem from './item';
import EventDispatcher from '../events/eventdispatcher';
import Events from '../events/events';

jest.mock('../events/eventdispatcher');

describe('Item', () => {
    beforeEach(() => EventDispatcher.dispatch.mockClear());

    describe('initialization', () => {
        it('should not be equipped by default', () => {
            expect(createItem().isEquipped).toBeFalsy();
        });

        it('should be isEquippable by default', () => {
            expect(createItem().isEquippable).toBeTruthy();
        });

        it('should override isEquipped with props', () => {
            const item = createItem({ isEquipped: true });
            expect(item.isEquipped).toBeTruthy();
        });

        it('should override isEquippable with props', () => {
            const item = createItem({ isEquippable: false });
            expect(item.isEquippable).toBeFalsy();
        });
    });

    describe('equipping', () => {
        it('should not equip item if it is not equippable', () => {
            const item = createItem({ isEquippable: false });
            item.equip();
            expect(item.isEquipped).toBeFalsy();
        });

        it('should set item equipped', () => {
            const item = createItem();
            item.equip();
            expect(item.isEquipped).toBeTruthy();
        });

        it('should emit an item equipped event', () => {
            const item = createItem();
            item.equip();
            const mockCallParam = EventDispatcher.dispatch.mock.calls[0][0];
            expect(mockCallParam).toBeInstanceOf(Events.ItemEquippedEvent);
            expect(mockCallParam.condition).toBeTruthy();
        });

        it('should not emit event if item is not equippable', () => {
            const item = createItem({ isEquippable: false });
            item.equip();
            expect(EventDispatcher.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('unequipping', () => {
        it('should set item unequipped', () => {
            const item = createItem({ isEquipped: true });
            item.unequip();
            expect(item.isEquipped).toBeFalsy();
        });

        it('should emit an event when unequipped', () => {
            const item = createItem({ isEquipped: true });
            item.unequip();
            const mockCallParam = EventDispatcher.dispatch.mock.calls[0][0];
            expect(mockCallParam).toBeInstanceOf(Events.ItemEquippedEvent);
            expect(mockCallParam.condition).toBeFalsy();
        });

        it('should not emit event if item is not equipped', () => {
            const item = createItem({ isEquipped: false });
            item.unequip();
            expect(EventDispatcher.dispatch).not.toHaveBeenCalled();
        });
    });
});
