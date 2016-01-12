'use strict';

describe('Service: serviceLogin', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var serviceLogin;
  beforeEach(inject(function (_serviceLogin_) {
    serviceLogin = _serviceLogin_;
  }));

  it('should do something', function () {
    expect(!!serviceLogin).toBe(true);
  });

});
