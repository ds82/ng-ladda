'use strict';

var proxy = require('proxyquireify')(require);
var LaddaStub = jasmine.createSpyObj('Ladda', ['create']);
var LaddaInstance = jasmine.createSpyObj('LaddaInstance', ['start', 'stop']);
LaddaStub.create.and.returnValue(LaddaInstance);

proxy('../', {ladda: LaddaStub});

describe('io.dennis.ladda', function() {
  var mock = angular.mock;
  var ae = angular.element;

  describe('directive:ladda', function() {
    var $injector, $compile, $rootScope;
    var $scope;
    var ngLaddaServiceStub;

    beforeEach(mock.module('io.dennis.ladda', function($provide) {
      ngLaddaServiceStub = jasmine.createSpyObj('ngLaddaService', ['subscribe']);
      $provide.value('ngLaddaService', ngLaddaServiceStub);
    }));
    beforeEach(inject(function(_$injector_, _$compile_, _$rootScope_) {
      $injector = _$injector_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
    }));

    it('should wrap the inner elements of the button in a ladda-button element', function() {
      var html = '<button ng-ladda><b>Some</b><i>thing</i> <b>shiny</b></button>';
      var element = ae(html);
      var compiled = $compile(element)($scope);

      $rootScope.$apply();

      var children = compiled.children();

      expect(children.length).toEqual(1);

      var child = ae(children[0]);
      expect(child.hasClass('ladda-button')).toEqual(true);
      expect(child.children().length).toEqual(3);
    });

    it('should subscribe to ladda service', function() {
      var html = '<button ng-ladda><b>Something</b></button>';
      var element = ae(html);
      $compile(element)($scope);

      $rootScope.$apply();

      expect(ngLaddaServiceStub.subscribe).toHaveBeenCalled();
    });

    it('should create ladda element', function() {
      var html = '<button ng-ladda><b>Something</b></button>';
      var element = ae(html);
      $compile(element)($scope);

      expect(LaddaStub.create).toHaveBeenCalledWith(element[0]);
    });

    it('should start the ladda onRequest(true) call', function() {
      var html = '<button ng-ladda><b>Something</b></button>';
      var element = ae(html);
      $compile(element)($scope);

      var onRequest = ngLaddaServiceStub.subscribe.calls.mostRecent().args[2];
      onRequest(true);

      $rootScope.$apply();
      expect(LaddaInstance.start).toHaveBeenCalled();
    });

    it('should stop the ladda onRequest(false) call', function() {
      var html = '<button ng-ladda><b>Something</b></button>';
      var element = ae(html);
      $compile(element)($scope);

      var onRequest = ngLaddaServiceStub.subscribe.calls.mostRecent().args[2];
      onRequest(false);

      $rootScope.$apply();
      expect(LaddaInstance.stop).toHaveBeenCalled();
    });

  });

});

