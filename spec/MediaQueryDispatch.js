/*global describe: true, it: true, expect: true, spyOn:true, jasmine: true */

var MediaQueryDispatch = require('../src/MediaQueryDispatch');
var MediaQuery = require('../src/MediaQuery');
var QueryHandler = require('../src/QueryHandler');

describe('MediaQueryDispatch', function() {

  var query = 'max-width:1000px';

  it('throws if matchMedia is not present', function() {
    // Arrange
    var matchMedia    = window.matchMedia;
    window.matchMedia = undefined;

    // Act & assert
    expect(function() {
      new MediaQueryDispatch();
    }).toThrowError('matchMedia not present, legacy browsers require a polyfill');

    // Cleanup
    window.matchMedia = matchMedia;
  });

  it('tests for browser capability', function() {
    // Arrange
    var browserIsCapable = true,
      matchMedia = window.matchMedia,
      mqd;

    window.matchMedia = jasmine.createSpy('matchMedia').and.returnValue({ matches: browserIsCapable });


    // Act
    mqd = new MediaQueryDispatch();

    // Assert
    expect(window.matchMedia).toHaveBeenCalled();
    expect(mqd.browserIsIncapable).toBe(!browserIsCapable);

    window.matchMedia = matchMedia;
  });

  //TODO: test for isUnconditional

  it('allows a match function to be registered', function() {
    // Arrange
    var mqd = new MediaQueryDispatch(),
      mediaQuery;

    // Act
    mqd.register(query, function(){});

    // Assert
    mediaQuery = mqd.queries[query];
    expect(mediaQuery).not.toBe(undefined);
    expect(mediaQuery.handlers.length).toBe(1);

  });

  it('allows handler objects to be registered', function() {
    // Arrange
    var mqd = new MediaQueryDispatch(),
      mediaQuery;

    // Act
    mqd.register(query, {});

    // Assert
    mediaQuery = mqd.queries[query];
    expect(mediaQuery.handlers.length).toBe(1);
  });

  it('allows arrays of handlers to be registered', function() {
    // Arrange
    var mqd      = new MediaQueryDispatch(),
      handlers = [{}, {}, {}],
      mediaQuery;

    // Act
    mqd.register(query, handlers);

    // Assert
    mediaQuery = mqd.queries[query];
    expect(mediaQuery.handlers.length).toBe(handlers.length);
  });

  it('allows multiple handlers for same query to be registered at different times', function() {
    // Arrange
    var mqd = new MediaQueryDispatch();
    var addHandlerSpy = spyOn(MediaQuery.prototype, 'addHandler');

    // Act
    mqd.register(query, {});
    mqd.register(query, {});

    // Assert
    expect(addHandlerSpy.calls.count()).toBe(2);
  });

  it('allows entire queries to be unregistered', function() {
    // Arrange
    var mqd      = new MediaQueryDispatch(),
      destroy  = spyOn(QueryHandler.prototype, 'destroy'),
      handlers = [
        jasmine.createSpyObj('handler1', ['match']),
        jasmine.createSpyObj('handler2', ['match'])
      ];

    mqd.register(query, handlers);

    // Act
    mqd.unregister(query);

    // Assert
    expect(destroy.calls.count()).toBe(handlers.length);
    expect(mqd.queries[query]).toBe(undefined);
  });

  it('allows individual handlers to be unregistered', function() {
    // Arrange
    var mqd       = new MediaQueryDispatch(),
      removeSpy = spyOn(MediaQuery.prototype, 'removeHandler'),
      handlers  = [
        jasmine.createSpyObj('handler1', ['match']),
        jasmine.createSpyObj('handler2', ['match'])
      ];

    // Act
    mqd.register(query, handlers);
    mqd.unregister(query, handlers[1]);

    // Assert
    expect(removeSpy.calls.count()).toBe(1);
  });

  it('returns if unregistering unrecognised media query', function() {
    // Arrange
    var mqd        = new MediaQueryDispatch(),
      removeSpy  = spyOn(MediaQuery.prototype, 'removeHandler'),
      destroySpy = spyOn(QueryHandler.prototype, 'destroy'),
      handler    = jasmine.createSpyObj('handler1', ['match']),
      result;

    // Act
    mqd.register(query, handler);
    result = mqd.unregister('klgfjglkfdsajflkj', handler);

    // Assert
    expect(removeSpy).not.toHaveBeenCalled();
    expect(destroySpy).not.toHaveBeenCalled();
    expect(result).toBe(mqd);
  });

});