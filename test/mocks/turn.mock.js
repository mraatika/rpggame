import SignalMock from './signal.mock';

const TurnMock = function() {
    this.turnDone = new SignalMock();
};

TurnMock.prototype = {
    dispose: function() {},
    start: function() {},
    update: function() {}
};

export default TurnMock;