'use strict';

describe('io.dennis.ladda', function() {
  var mock = angular.mock;
  var ae = angular.element;

  describe('directive:ladda', function() {
    var $injector, $compile, $rootScope;
    var $scope;

    beforeEach(mock.module('io.dennis.contextmenu'));
    beforeEach(inject(function(_$injector_, _$compile_, _$rootScope_) {
      $injector = _$injector_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
    }));


  });

});

