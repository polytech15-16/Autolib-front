'use strict';

describe('Controller: UserRegisterCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var UserRegisterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserRegisterCtrl = $controller('UserRegisterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UserRegisterCtrl.awesomeThings.length).toBe(3);
  });
});
