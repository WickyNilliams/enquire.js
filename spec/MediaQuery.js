var MediaQuery = require('../src/MediaQuery');
var QueryHandler = require('../src/QueryHandler');

describe('MediaQuery', function() {

  var handler,
    matchMedia,
    mq,
    mm;

  beforeEach(function() {
    matchMedia = window.matchMedia;
    mq      = new MediaQuery('((max-width:1000px))');
    handler = jasmine.createSpyObj('handler', ['match', 'unmatch', 'setup']);
    mm      = jasmine.createSpy('matchMedia');
    window.matchMedia = mm;
  });

  afterEach(function() {
    window.matchMedia = matchMedia;
  });

  it('will add a media query listener when constructed', function() {
    var mql = jasmine.createSpyObj('mql', ['addListener']),
      mq;

    mm.and.returnValue(mql);
    mq = new MediaQuery('(max-width: 1000px)');

    expect(mql.addListener).toHaveBeenCalledWith(mq.listener);
  });


  it('can accept new handlers', function() {
    // Arrange
    var originalLength = mq.handlers.length;

    // Act
    mq.addHandler(handler);

    // Assert
    expect(originalLength).toBe(0);
    expect(mq.handlers.length).toBe(1);
  });

  it('will turn on handler when added if query is already matching', function() {
    // Arrange
    mm.and.returnValue({matches:true, addListener : function() {}});
    mq = new MediaQuery('(max-width:1000px)');

    // Act
    mq.addHandler(handler);

    // Assert
    expect(handler.match).toHaveBeenCalled();
  });

  it('can remove handlers', function() {
    // Arrange
    var handler2 = jasmine.createSpyObj('handler', ['match', 'unmatch']),
      equals   = spyOn(QueryHandler.prototype, 'equals').and.callThrough(),
      destroy  = spyOn(QueryHandler.prototype, 'destroy'),
      length;

    mq.addHandler(handler);
    mq.addHandler(handler2);

    length = mq.handlers.length;

    // Act
    mq.removeHandler(handler);

    // Assert
    expect(mq.handlers.length).toBe(length-1);
    expect(equals.calls.count()).not.toBe(length); // ensure early exit
    expect(destroy.calls.count()).toBe(1); // destroy called just once
  });

  it('can be short-circuited with isUnconditional flag', function() {
    // Arrange
    mq.isUnconditional = true;

    // Act
    mq.addHandler(handler);

    // Assert
    expect(mq.matches()).toBe(true);
  });

  it('destroys all handlers and removes listener when cleared', function() {
    // Arrange
    var handler1 = jasmine.createSpyObj('handler', ['match', 'unmatch']),
      handler2 = jasmine.createSpyObj('handler', ['match', 'destroy']);

    mq.mql = jasmine.createSpyObj('mql',['addListener', 'removeListener']);

    mq.addHandler(handler1);
    mq.addHandler(handler2);

    // Act
    mq.clear();

    // Assert
    expect(handler1.unmatch).toHaveBeenCalled();
    expect(handler2.destroy).toHaveBeenCalled();
    expect(mq.mql.removeListener).toHaveBeenCalledWith(mq.listener);
    expect(mq.handlers.length).toBe(0);
  });

  it('will consider a match if unconditional flag set or if media query matches', function() {
    // Arrange
    var unconditionalMatch,
      mediaQueryMatch;

    mq.isUnconditional = true;
    unconditionalMatch = mq.matches();

    mq.isUnconditional = false;
    mq.mql = { matches : true };

    mediaQueryMatch = mq.matches();

    // Assert
    expect(unconditionalMatch).toBe(true);
    expect(mediaQueryMatch).toBe(true);
  });

});
