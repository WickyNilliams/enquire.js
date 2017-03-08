var MediaQueryDispatch = require('../src/MediaQueryDispatch');
var MediaQuery = require('../src/MediaQuery');
var QueryHandler = require('../src/QueryHandler');

describe('MediaQueryDispatch', function() {

  var query = 'max-width:1000px';
  var matchMedia;

  beforeEach(function() {
    matchMedia = window.matchMedia;
  });

  afterEach(function() {
    window.matchMedia = matchMedia;
  });

  it('throws if matchMedia is not present', function() {
    window.matchMedia = undefined;

    expect(function() {
      new MediaQueryDispatch();
    }).toThrowError('matchMedia not present, legacy browsers require a polyfill');
  });

  it('tests for browser capability', function() {
    window.matchMedia = jasmine.createSpy('matchMedia').and.returnValue({ matches: true });

    var mqd = new MediaQueryDispatch();

    expect(window.matchMedia).toHaveBeenCalled();
    expect(mqd.browserIsIncapable).toBe(false);
  });

  //TODO: test for isUnconditional

  it('allows a match function to be registered', function() {
    var mqd = new MediaQueryDispatch();
    mqd.register(query, function(){});

    var mediaQuery = mqd.queries[query];
    expect(mediaQuery).not.toBe(undefined);
    expect(mediaQuery.handlers.length).toBe(1);

  });

  it('allows handler objects to be registered', function() {
    var mqd = new MediaQueryDispatch();
    mqd.register(query, {});

    expect(mqd.queries[query].handlers.length).toBe(1);
  });

  it('allows arrays of handlers to be registered', function() {
    var mqd      = new MediaQueryDispatch();
    var handlers = [{}, {}, {}];

    mqd.register(query, handlers);

    expect(mqd.queries[query].handlers.length).toBe(handlers.length);
  });

  it('allows multiple handlers for same query to be registered at different times', function() {
    var mqd = new MediaQueryDispatch();
    var spy = spyOn(MediaQuery.prototype, 'addHandler');

    mqd.register(query, {});
    mqd.register(query, {});

    expect(spy.calls.count()).toBe(2);
  });

  it('allows entire queries to be unregistered', function() {
    var mqd      = new MediaQueryDispatch();
    var destroy  = spyOn(QueryHandler.prototype, 'destroy');
    var handlers = [
      jasmine.createSpyObj('handler1', ['match']),
      jasmine.createSpyObj('handler2', ['match'])
    ];

    mqd.register(query, handlers);
    mqd.unregister(query);

    expect(destroy.calls.count()).toBe(handlers.length);
    expect(mqd.queries[query]).toBe(undefined);
  });

  it('allows individual handlers to be unregistered', function() {
    var mqd       = new MediaQueryDispatch();
    var removeSpy = spyOn(MediaQuery.prototype, 'removeHandler');
    var handlers  = [
      jasmine.createSpyObj('handler1', ['match']),
      jasmine.createSpyObj('handler2', ['match'])
    ];

    mqd.register(query, handlers);
    mqd.unregister(query, handlers[1]);

    expect(removeSpy.calls.count()).toBe(1);
  });

  it('returns if unregistering unrecognised media query', function() {
    var mqd        = new MediaQueryDispatch();
    var removeSpy  = spyOn(MediaQuery.prototype, 'removeHandler');
    var destroySpy = spyOn(QueryHandler.prototype, 'destroy');
    var handler    = jasmine.createSpyObj('handler1', ['match']);

    mqd.register(query, handler);
    var result = mqd.unregister('klgfjglkfdsajflkj', handler);

    expect(removeSpy).not.toHaveBeenCalled();
    expect(destroySpy).not.toHaveBeenCalled();
    expect(result).toBe(mqd);
  });

});