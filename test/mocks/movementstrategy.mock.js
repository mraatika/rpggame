import sinon from 'sinon';
import SignalMock from './signal.mock';

const MovementStrategyMock = function() {
    this.moveDone = new SignalMock();
};

MovementStrategyMock.prototype = {
    dispose: sinon.spy()
};

export default MovementStrategyMock;