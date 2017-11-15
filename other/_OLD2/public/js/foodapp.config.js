angular.module('foodApp').config(
	function ($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
				template: `<div class="wrap">Home</div>`
			}).
			when('/recipes', {
				template: '<recipe-list></recipe-list>'
			}).
			when('/reviews', {
				template: '<review-list></review-list>'
			}).
			otherwise('/404');
		$locationProvider.html5Mode(true)
	})