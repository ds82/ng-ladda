'use strict';

var $set    = require('lodash.set');
var $get    = require('lodash.get');
var $filter = require('lodash.filter');

angular.module('io.dennis.ladda')
  .provider('ngLaddaService', LaddaServiceProvider)
  .config(Config)
;

LaddaServiceProvider.$inject = [];
function LaddaServiceProvider() {

  var laddaService = false;

  var routeMap = {};
  var eventMap = {};

  this.$get = get;

  function get() {
    if (!laddaService) {
      laddaService = new LaddaService();
    }
    return laddaService;
  }

  function LaddaService() {
    var self = this;
    self.register = register;
    self.subscribe = subscribe;
    self.triggerResponse = triggerResponse;
    self.triggerRequest = triggerRequest;

    function register(method, route, event) {
      $set(routeMap, [method, route], event);
    }

    function subscribe(scope, event, fn) {
      var list = $get(eventMap, event, []);
      list.push(fn);
      $set(eventMap, event, list);

      scope.$on('$destroy', function() {
        cancelSubscription(event, fn);
      });
    }

    function cancelSubscription(event, fn) {
      var list = $get(eventMap, event, []);
      var find = list.indexOf(fn);

      if (find > -1) {
        list.splice(find, 1);
        $set(eventMap, event, list);
      }
    }

    function triggerRequest(method, route) {
      trigger(true, method, route);
    }

    function triggerResponse(method, route) {
      trigger(false, method, route);
    }

    function trigger(start, method, route) {
      var event = $get(routeMap, [method, route], false);
 
      var matchingMethods = $get(routeMap, [method], {});
      var events = $filter(matchingMethods, function(event, registeredRoute) {
        return !!route.match(new RegExp(registeredRoute));
      });

      events.forEach(function(event) {
        if (event) {
          var list = $get(eventMap, event, []);
          list.forEach(function(cb) { cb(start); });
        }
      });
    }
  }
}

Config.$inject = ['$httpProvider', 'ngLaddaServiceProvider'];
function Config($httpProvider, ngLaddaServiceProvider) {
  $httpProvider.interceptors.push(Interceptor);

  function Interceptor() {
    var bus = ngLaddaServiceProvider.$get();

    return {
      request: request,
      requestError: requestError,
      response: response,
      responseError: responseError
    };

    function request(config) {
      bus.triggerRequest(config.method, config.url);
      return config;
    }

    function requestError(rejection) {
      bus.triggerResponse(rejection.config.method, rejection.config.url);
      return rejection;
    }

    function response(res) {
      bus.triggerResponse(res.config.method, res.config.url);
      return res;
    }

    function responseError(rejection) {
      bus.triggerResponse(rejection.config.method, rejection.config.url);
      return rejection;
    }
  }
}
