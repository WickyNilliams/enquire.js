var QueryHandler = require('../src/QueryHandler');

describe('QueryHandler', function() {
  var options;

  beforeEach(function() {
    options = jasmine.createSpyObj('options', ['match', 'unmatch', 'setup', 'destroy']);
  });

  it('is initialised if setup not deferred', function() {
    var handler = new QueryHandler(options);
    expect(handler.initialised).toBe(true);
  });

  it('is not initialised if setup deferred', function () {
    options.deferSetup = true;
    var handler = new QueryHandler(options);

    expect(handler.initialised).toBeFalsy();
  });

  it('stores supplied handler', function() {
    var handler = new QueryHandler(options);

    expect(handler.options).toBe(options);
  });

  it('calls setup handler and sets to initialised during setup', function() {
    options.deferSetup = true;
    var handler = new QueryHandler(options);

    handler.setup();

    expect(options.setup).toHaveBeenCalled();
    expect(handler.initialised).toBe(true);
  });

  it('will call a setup function followed by on', function() {
    options.deferSetup = true;
    var handler = new QueryHandler(options);

    handler.on();

    expect(options.setup).toHaveBeenCalled();
    expect(options.match).toHaveBeenCalled();
  });

  it('calls match handler when turned on', function() {
    var handler = new QueryHandler(options);
    handler.on();

    expect(options.match).toHaveBeenCalled();
  });

  it('calls unmatch handler when turned off', function() {
    var handler = new QueryHandler(options);
    handler.off();

    expect(options.unmatch).toHaveBeenCalled();
  });

  it('can test for equality', function() {
    var handler = new QueryHandler(options);

    var equalityByObject = handler.equals(options);
    var equalityByFunction = handler.equals(options.match);

    expect(equalityByObject).toBe(true);
    expect(equalityByFunction).toBe(true);
  });

  it('calls through to destroy if supplied', function() {
    var handler = new QueryHandler(options);
    handler.destroy();

    expect(options.destroy).toHaveBeenCalled();
  });

  it('calls through to unmatch if destroy not available', function() {
    var spy     = jasmine.createSpyObj('options', ['match', 'unmatch']);
    var handler = new QueryHandler(spy);

    handler.destroy();

    expect(spy.unmatch).toHaveBeenCalled();
  });

});