import createItem from './item';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';

jest.mock('../events/eventdispatcher');

describe('Item', () => {
    beforeEach(() => sendEvent.mockClear());

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

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];
            expect(type).toBe(EventTypes.ITEM_EQUIPPED_EVENT);
            expect(props.condition).toBe(true);
        });

        it('should not emit event if item is not equippable', () => {
            const item = createItem({ isEquippable: false });
            item.equip();
            expect(sendEvent).not.toHaveBeenCalled();
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

            const type = sendEvent.mock.calls[0][0];
            const props = sendEvent.mock.calls[0][1];
            expect(type).toBe(EventTypes.ITEM_EQUIPPED_EVENT);
            expect(props.condition).toBe(false);
        });

        it('should not emit event if item is not equipped', () => {
            const item = createItem({ isEquipped: false });
            item.unequip();
            expect(sendEvent).not.toHaveBeenCalled();
        });
    });
});
