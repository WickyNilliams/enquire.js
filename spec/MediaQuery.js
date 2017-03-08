var MediaQuery = require('../src/MediaQuery');
var QueryHandler = require('../src/QueryHandler');

describe('MediaQuery', function() {

  var handler;
  var matchMedia;
  var mq;
  var mm;

  beforeEach(function() {
    mq      = new MediaQuery('((max-width:1000px))');
    handler = jasmine.createSpyObj('handler', ['match', 'unmatch', 'setup']);

    matchMedia = window.matchMedia;
    window.matchMedia = mm = jasmine.createSpy('matchMedia');
  });

  afterEach(function() {
    window.matchMedia = matchMedia;
  });

  it('will add a media query listener when constructed', function() {
    var mql = jasmine.createSpyObj('mql', ['addListener']);

    mm.and.returnValue(mql);
    var mq = new MediaQuery('(max-width: 1000px)');

    expect(mql.addListener).toHaveBeenCalledWith(mq.listener);
  });


  it('can accept new handlers', function() {
    var originalLength = mq.handlers.length;

    mq.addHandler(handler);

    expect(originalLength).toBe(0);
    expect(mq.handlers.length).toBe(1);
  });

  it('will turn on handler when added if query is already matching', function() {
    mm.and.returnValue({matches:true, addListener : function() {}});
    mq = new MediaQuery('(max-width:1000px)');

    mq.addHandler(handler);

    expect(handler.match).toHaveBeenCalled();
  });

  it('can remove handlers', function() {
    var handler2 = jasmine.createSpyObj('handler', ['match', 'unmatch']);
    var equals   = spyOn(QueryHandler.prototype, 'equals').and.callThrough();
    var destroy  = spyOn(QueryHandler.prototype, 'destroy');

    mq.addHandler(handler);
    mq.addHandler(handler2);

    var length = mq.handlers.length;

    mq.removeHandler(handler);

    expect(mq.handlers.length).toBe(length - 1);
    expect(equals.calls.count()).not.toBe(length); // ensure early exit
    expect(destroy.calls.count()).toBe(1); // destroy called just once
  });

  it('can be short-circuited with isUnconditional flag', function() {
    mq.isUnconditional = true;
    mq.addHandler(handler);

    expect(mq.matches()).toBe(true);
  });

  it('destroys all handlers and removes listener when cleared', function() {
    var handler1 = jasmine.createSpyObj('handler1', ['match', 'unmatch']);
    var handler2 = jasmine.createSpyObj('handler2', ['match', 'destroy']);
    mq.mql = jasmine.createSpyObj('mql',['addListener', 'removeListener']);

    mq.addHandler(handler1);
    mq.addHandler(handler2);
    mq.clear();

    expect(handler1.unmatch).toHaveBeenCalled();
    expect(handler2.destroy).toHaveBeenCalled();
    expect(mq.mql.removeListener).toHaveBeenCalledWith(mq.listener);
    expect(mq.handlers.length).toBe(0);
  });

  it('will consider a match if unconditional flag set or if media query matches', function() {
    mq.isUnconditional = true;
    var unconditionalMatch = mq.matches();

    mq.isUnconditional = false;
    mq.mql = { matches : true };

    var mediaQueryMatch = mq.matches();

    expect(unconditionalMatch).toBe(true);
    expect(mediaQueryMatch).toBe(true);
  });

});
