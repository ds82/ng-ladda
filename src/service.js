'use strict';

angular.module('io.dennis.ladda')
  .provider('ngLaddaService', LaddaServiceProvider)
  .config(Config)
;

LaddaServiceProvider.$inject = [];
function LaddaServiceProvider() {

  var laddaService = false;
  this.$get = $get;

  function $get() {
    if (!laddaService) {
      laddaService = new LaddaService();
    }
    return laddaService;
  }

  function LaddaService() {
    var self = this;
    self.register = register;
    self.triggerResponse = triggerResponse;
    self.triggerRequest = triggerRequest;

    function register(method, route, event) {
      console.log('register', method, route, event);
    }

    function triggerRequest(method, route) {
      console.log('triggerRequest', method, route);
    }

    function triggerResponse(method, route) {
      console.log('triggerResponse', method, route);
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
