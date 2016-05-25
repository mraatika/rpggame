import SignalMock from './signal.mock';

const TurnMock = function() {
    this.turnDone = new SignalMock();
};

TurnMock.prototype = {
    dispose: function() {},
    start: function() {}
};

export default TurnMock;