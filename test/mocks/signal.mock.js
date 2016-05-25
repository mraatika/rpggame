import sinon from 'sinon';

const SignalMock = function() {};

SignalMock.prototype = {
    dispatch: sinon.stub(),
    dispose: sinon.spy(),
    add: sinon.stub(),
    remove: sinon.spy()
};

export default SignalMock;