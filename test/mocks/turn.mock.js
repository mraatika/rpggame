import SignalMock from './signal.mock';
import GameMock from './game.mock';

const TurnMock = function() {
    this.turnDone = new SignalMock();
    this.state = {
        game: new GameMock()
    };
};

TurnMock.prototype = {
    dispose: function() {},
    start: function() {},
    update: function() {}
};

export default TurnMock;