'use strict';

var Ladda = require('ladda');

angular.module('io.dennis.ladda')
  .directive('ngLadda', Enchilada);

Enchilada.$inject = ['ngLaddaService'];
function Enchilada(ngLaddaService) {
  return {
    scope: false,
    restrict: 'A',
    link: link
  };

  function link(scope, element, attrs) {
    element
      .css('overflow', 'inherit')
      .addClass('ladda-button');

    var wrap = document.createElement('span');
    wrap.setAttribute('class', 'ladda-button');
    wrapInner(element[0], wrap);

    var ladda = Ladda.create(element[0]);
    ngLaddaService.subscribe(scope, attrs.ngLadda, onRequest);

    function onRequest(start) {
      return (start) ? ladda.start() : ladda.stop();
    }
  }
}

function wrapInner(parent, wrapper) {
  parent.appendChild(wrapper);
  while (parent.firstChild !== wrapper) {
    wrapper.appendChild(parent.firstChild);
  }
}
