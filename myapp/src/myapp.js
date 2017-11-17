import angular from 'angular'
import ngRoute from 'angular-route'

const app = angular.module('myApp', ['ngRoute'])

app.config(
    function config($locationProvider, $routeProvider) {
        // $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(true)
        $routeProvider.
        when('/', {
            template: '<greet-user></greet-user>'
        }).
        when('/bye', {
            template: '<bye-user></bye-user>'
        }).
        otherwise('/404');
    });

app.component('greetUser', {
    template: `
    <div class="wrap">
      <h4>Hello, {{ $ctrl.user }}!</h4>
      <p><a href="/bye">Bye</a></p>
    </div>`,
    controller: function GreetUserController() {
        this.user = 'world';
    }
});

app.component('byeUser', {
    template: `<div class="wrap">Bye, {{$ctrl.user}}!</div>`,
    controller: function ByeUserController() {
        this.user = 'cruel world';
    }
});


app.controller('NavController', function ($scope, $location) {
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  };
})



// const panels = document.querySelectorAll('.panel')
// const triggers = document.querySelectorAll('a')

// function toggleOpen(){
//   closePanels()
//   this.classList.toggle('active')
// }

// function closePanels(){
//   panels.forEach( (panel) => panel.classList.remove('active'))
// }

// panels.forEach( (panel) => panel.addEventListener('click', toggleOpen))
