# ng-ladda

[ladda]: https://github.com/hakimel/Ladda
[gh-pages]: https://ds82.github.io/ng-ladda/demo/

an angular module to use [ladda] with ease.
This module is *different* from other angular ladda modules you find on github.

**WORK IN PROGRESS**

*Todo*:

* ~~clean up callbacks~~
* add unit tests


## Demo

[demo][gh-pages]

## Problem

Do you know [ladda]? I love to use these button animations as load indicators in my angular apps. But their usage always came with a drawback .. I have to manage the loading state of the buttons somehow in my app. That means boilercode in my controllers .. even if you have an directive to handle ladda.

e.g., some typical controller and template code:

```js
angular.module('app').controller('SomeController', SomeController);

SomeController.$inject = ['SomeResouce'];
function SomeController($resource) {
  var vm = this;

  vm.load = load;
  vm.data = {};
  vm.meta = {
    ladda: false;
  }

  function load() {
    vm.meta.ladda = true;
    $resource.query().$promise.then(onSuccess).finally(onDone);
  }

  function onSuccess(data) {
    vm.data = data;
  }

  function onDone() {
    vm.meta.ladda = false;
  }
}
```

```html
  ...
    <button ladda="vm.meta.ladda" ng-click="vm.load()">Load something!</button>
  ...
```


And this for every controller that handles some sort of http load/save/whatever. That sums up to a lot of boilerplate code just to handle ladda buttons


## Solution

I think we can do better. I think we can do this without *ANY* boilerplate code in our controllers. Instead of telling every button to start or stop an indicator, we link every indicator to a http route. Becuase thats what it indicates, right?.

Lets rewrite the example above with ng-ladda:

```js
angular.module('app').run(Setup).controller('SomeController', SomeController);

Setup.$inject = ['ngLaddaService'];
function Setup($ladda) {
  // link a httpRequest to a unique event/name
  $ladda.register('GET', '/some/resource/query', 'query-some-resource');
}

SomeController.$inject = ['SomeResouce'];
function SomeController($resource) {
  var vm = this;

  vm.load = load;
  vm.data = {};

  function load() {
    $resource.query().$promise.then(onSuccess);
  }

  function onSuccess(data) {
    vm.data = data;
  }
}
```

```html
  ...
    <button ladda="query-some-resource" ng-click="vm.load()">Load something!</button>
  ...
```

No boilerplate code in your controller (:cat:)
