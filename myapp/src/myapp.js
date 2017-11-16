import angular from 'angular';
import ngRoute from 'angular-route';

var app = angular.module('foodApp', ['ngRoute']);

app.config(
	function ($routeProvider, $locationProvider) {
		$routeProvider.
		when('/', {
			template: `<div class="wrap">Test</div>`
		}).
		when('/recipes', {
			template: '<recipe-list></recipe-list>'
		}).
		when('/recipes/:recipeId', {
			template: '<recipe-detail></recipe-detail>'
		});
    // $locationProvider.html5Mode(true)
  })


app.component('recipeList', {
	templateUrl: '/includes/recipes.html' ,

	controller: function RecipeListController( $http ) {
		this.orderProp = 'date';
		$http.get('data/recipes.json')
		.then( (response) => this.recipes = response.data)
	}
})


app.component('recipeDetail', {
	template: `
	<div class="wrap" itemscope itemtype="http://schema.org/Recipe">
	<img style="width: 25%; float: left; margin-right: 2rem; margin-bottom: 2rem;" ng-src="images/home/{{ $ctrl.recipe.mainImageUrl }}" />
	<h1>{{ $ctrl.recipe.title }}</h1>

	<p>{{ $ctrl.recipe.description }}</p>

	<h3 style="clear: both">Ingredients</h3>
	<ul class="ingredients">
	<li ng-repeat="ingredient in $ctrl.recipe.ingredients">
	{{ ingredient }}
	</li>
	</ul>

	</div>
	`,

	controller: function RecipeDetailController($http, $routeParams) {
		$http.get('data/' + $routeParams.recipeId +  '.json')
		.then(response => this.recipe = response.data);
	}

});


// app.controller('myCtrl', $scope => $scope.name = "John Doe")


// app.config(
// 	function config($locationProvider, $routeProvider) {
// 		// $locationProvider.hashPrefix('!');
// 		$locationProvider.html5Mode(true);
// 		$routeProvider.
// 		when('/', {
// 			template: '<greet-user></greet-user>'
// 		}).
// 		when('/bye', {
// 			template: '<bye-user></bye-user>'
// 		}).
// 		otherwise('/404');
// 	});

// app.component('greetUser', {
//     template: `
//     <div class="wrap">
//       <h4>Hello, {{ $ctrl.user }}!</h4>
//       <p><a href="/bye">Bye</a></p>
//     </div>`,
//     controller: function GreetUserController() {
//         this.user = 'world';
//     }
// });

// app.component('byeUser', {
//     template: `<div class="wrap">Bye, {{$ctrl.user}}!</div>`,
//     controller: function ByeUserController() {
//         this.user = 'cruel world';
//     }
// });

app.controller('NavController', function ($scope, $location) {
	$scope.isActive = function (viewLocation) {
		var active = (viewLocation === $location.path());
		return active;
	};
})





// const panels = document.querySelectorAll('.panel')
// const triggers = document.querySelectorAll('a')

// function toggleOpen(){
// 	closePanels()
// 	this.classList.toggle('active')
// }

// function closePanels(){
// 	panels.forEach( (panel) => panel.classList.remove('active'))
// }

// panels.forEach( panel => panel.addEventListener('click', toggleOpen))