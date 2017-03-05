#Session 6 - placeholder

###Fetching the Data

Let's use `recipes.json` in the data folder instead of keeping the data model in the controller. 

We fetch the dataset from our server using one of Angular's built-in [$http](https://docs.angularjs.org/api/ng/service/$http) service.

$http:
* a core (built into Angular) service that facilitates communication with the remote HTTP servers
* need to make it available to the recipeList component's controller via [dependency injection](https://docs.angularjs.org/guide/di).

In `recipe-list.component.js` make $http available to the controller:

`controller: function RecipeListController($http) { ...`

Use `get` method of `$http` to fetch the json from the data folder:

```js
$http.get('data/recipes.json')
    .then(function (response) {
        this.recipes = response.data;
    });
```

Note: in JavaScript you can nest functions, that is you can define functions inside functions. 

While nested functions capture variables defined in parent functions in a closure, they do not inherit the this.

```js
	controller: function RecipeListController($http) {
		console.log('1: ' + this)
		$http.get('data/recipes.json')
			.then(function (response) {
				console.log('2: ' + this)
				this.recipes = response.data;
			});
	}
```

Create var `self` - since we are making the assignment of the recipes property in a nested function (`.then(function (response) {}`), where the `this` value is not defined, we introduce a local variable called self that points back to the RecipeListController.

```js
controller: function RecipeListController($http) {
    var self = this;
```

Here is the complete component:

```js
angular.module('foodApp').component('recipeList', {
  templateUrl: 'js/recipes/recipe-list.template.html',

  controller: function RecipeListController($http) { 
    var self = this;

    $http.get('data/recipes.json')
      .then(function (response) {
      self.recipes = response.data;
    })
  }
})
```

* `then` is a promise which runs the following function when the data is received (the `response`):
* since we want the `response.data` to belong to the RecipeListController function we assign it to `self.recipes`.

We should see no change to the view but the data is now being accessed via http from the data folder.

Aside: arrow functions avoid the 'this' problem. No need for a self variable.

```js
angular.module('foodApp').component('recipeList', {
	templateUrl: 'js/recipes/recipe-list.template.html',
	controller: function RecipeListController($http) {
		$http.get('data/recipes.json')
			.then((response) => this.recipes = response.data);
	}
})
```

###Dive into Promises

see index.html in the promises folder:

```js
<script>
    console.log('fetch data from beers - like $http')
    const posts = fetch('https://api.punkapi.com/v2/beers/'); 
    console.log(posts)
</script>
```
Fetch returns a promise

```js
const postsPromise = fetch('https://api.punkapi.com/v2/beers/');

postsPromise.then(data => {
  console.log(data)
})
```

data is a readable stream. Since a streat can be any type a data (images, audio, text) we need to convert it.

```
const postsPromise = fetch('https://api.punkapi.com/v2/beers/'); 

postsPromise
  .then(data => data.json())
  .then(data => { console.log(data) })
```

.then fires when there is a successful result. Listen for errors using .catch

```
const postsPromise = fetch('https://api.punkapi.com/v2/beers/'); 

postsPromise
  .then(data => data.json())
  .then(data => { console.log(data) })
  .catch((err) => {
    console.error(err);
  })
```
(Create an error by mangling the fetch URI.)

#####Custom Promises

See 2-custom-promise.html

#####Chaining (waterfall) Promises

See 3-chaining-promises.html

#####Multiple Promises

4-multiple-promises.html


###Adding Routing to Display Individual Recipes

Note the addition of recipe1309.json to the data directory. 

Use the json's `recipe.name` expression in the html template:

`<h1><a href="recipes/{{ recipe.name }} ">{{ recipe.title }}</a></h1>`

Now, clicking on the individual recipe shows a 404 address in the browser's location bar since we do not have routes set up for these yet.

###Recall

A module's .config() method gives us access to tools for configuration. To make the providers, services and directives defined in ngRoute available to our application, we added ngRoute as a dependency to our foodApp module:

```js
angular.module('foodApp', [
    'ngRoute'
]);
```

Application routes in Angular are declared via $routeProvider. This service makes it easy to wire together controllers, view templates, and the current URL location in the browser. 

We can configure the $route service (using it's provider) for our application. In order to be able to quickly locate the configuration code, we put it into a separate file and used the .config suffix.

Add a route for the new recipe links:

```js
angular.module('foodApp').config(
	function ($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
				template: `<div class="wrap">Test</div>`
			}).
			when('/recipes', {
				template: '<recipe-list></recipe-list>'
			}).
			when('/recipes/:recipeId', {
				template: `<div class="wrap">Detail</div>`
			}).
			when('/reviews', {
				template: '<review-list></review-list>'
			}).
			otherwise('/404');
		$locationProvider.html5Mode(true)
	})
```

* `:recipeId` - the $route service uses the route declaration — '/recipes/:recipeId' — as a template that is matched against the current URL. All variables defined with the : prefix are extracted into the (injectable) $routeParams object.

```html
<h1><a href="recipes/{{ recipe.name }} ">{{ recipe.title }}</a></h1>
```

Here we see nothing when we click on a recipe. That is because there is no defined view associated with the detail route.

The config file makes provision for a recipe-detail template. 

```js
angular.module('foodApp').config(
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
			}).
			when('/reviews', {
				template: '<review-list></review-list>'
			}).
			otherwise('/404');
		$locationProvider.html5Mode(true)
	})
```


###Creating the Recipe Details Component

Create stubs for recipe details in the new `recipes` directory:

`recipes/recipe-detail.module.js`:

```
angular.module('recipeDetail', [
    'ngRoute'
]);
```

We inject ngRoute into the recipeDetail module since we will be needing it.

We can then inject the routeParams service of ngRoute into our controller so that we can extract the recipeId.

`recipe-detail.component.js`

```
angular.module('foodApp').component('recipeDetail', {
  template: '<p>Detail view for {{$ctrl.recipeId}}</p>',

  controller: function RecipeDetailController($routeParams) {
    this.recipeId = $routeParams.recipeId;
  }

});
```

Add `recipeDetail` as a dependency to our application in `app.module.js`:

```
angular.module('recipeApp', [
    'ngRoute',
    'recipeDetail',
    'recipeList'
]);
```

Link to recipe-detail files:

```
<head>
    ...
    <script src="js/recipes/recipe-detail.component.js"></script>
    ...
</head>
```

Clicking on the recipe links in the main view should take you to our stub template. 


###Adding JSON and the Detail Template

Review `data/recipe1309.json`:

```js
{
  "name": "recipe1309", 
  "title": "Lasagna", 
  "date": "2013-09-01", 
  "description": "Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.", 
  "mainImageUrl": "lasagna-1.png",
  "images": ["lasagna-1.png","lasagna-2.png","lasagna-3.png","lasagna-4.png"],

  "ingredients": ["lasagna pasta", "tomatoes", "onions", "ground beef", "garlic", "cheese"]
}
```

Create `recipes/recipe-detail.template.html`

```html
<div class="wrap" itemscope itemtype="http://schema.org/Recipe">

    <h1>{{ $ctrl.recipe.title }}</h1>

    <p>{{ $ctrl.recipe.description }}</p>

    <h3>Ingredients</h3>
    <ul class="ingredients">
        <li ng-repeat="ingredient in $ctrl.recipe.ingredients">
            {{ ingredient }}
        </li>
    </ul>

</div>
```

Edit `recipe-detail/recipe-detail.component.js` to use templateUrl:

```js
angular.module('foodApp').component('recipeDetail', {
  templateUrl: 'js/recipes/recipe-detail.template.html',

  controller: function RecipeDetailController($routeParams) {
    this.recipeId = $routeParams.recipeId;
  }

});
```

Add $http to the dependancy list for our controller so we can access the json via http and create a variable `self` to point to the controller. 

We use the `self` variable in the response function to make the data available to the controller (variable scope).

```js
angular.module('foodApp').component('recipeDetail', {
  templateUrl: 'js/recipes/recipe-detail.template.html',

  controller: function RecipeDetailController($http, $routeParams) {

    var self = this;

    $http.get('data/' + $routeParams.recipeId +  '.json')
      .then(function(response){
      self.recipe = response.data;
    });
  }
});
```

###Search / Sort Filter

Add a search input field to the top of `recipe-list.template.html`. Note the use of [ng-model](https://docs.angularjs.org/api/ng/directive/ngModel):

```
<div class="wrap">
	<span>
		Search: <input ng-model=" $ctrl.query " />
	</span>
</div>
```

Add a filter to the ng-repeat directive:

`<li ng-repeat="recipe in $ctrl.recipes | filter:$ctrl.query">`

Data-binding is one of the core features in Angular. When the page loads, Angular binds the value of the input box to the data model variable specified with ngModel and keeps the two in sync.

The data that a user types into the input box (bound to $ctrl.query) is immediately available as a filter input in the list repeater (`recipe in $ctrl.recipes | filter:$ctrl.query`). When changes to the data model cause the repeater's input to change, the repeater updates the DOM to reflect the current state of the model.

The [filter](https://docs.angularjs.org/api/ng/filter/filter) function uses the `$ctrl.query` value to create a new array that contains only those records that match the query.

###Two Way Data Binding

Add a `<select>` element bound to `$ctrl.orderProp` to the top paragraph, so that our users can pick from the two provided sorting options.

```html
<div class="wrap">
	<span>
		Search: <input ng-model=" $ctrl.query " />
	</span>

	<span>
		Sort by:
		<select ng-model="$ctrl.orderProp">
    <option value="title">Alphabetical</option>
    <option value="date">Newest</option>
  </select>
	</span>
</div>
```
Note the values - these are from the json.

Chained the filter filter with the orderBy filter to further process the input for the repeater. 

[`orderBy`](https://docs.angularjs.org/api/ng/filter/orderBy) is a filter that takes an input array, copies it and reorders the copy which is then returned.

`<li ng-repeat="recipe in $ctrl.recipes | filter:$ctrl.query | orderBy:$ctrl.orderProp">`

Add a line to the controller in `recipe-list.component.js` after the recipes array that sets the default value of orderProp to age. If we had not set a default value here, the orderBy filter would remain uninitialized until the user picked an option from the drop-down menu.

`this.orderProp = 'date';`


##Adding an Image Swapper

To finish this exercise we will implement an image switcher similar to the one we created in earlier lessons but using our recipe-details.component.

Set the html template for the detail view to show one main image using this portion of the recipe1309.json: 
`"mainImageUrl": "lasagna-1.png",`

To get an image to display we add: `<img ng-src="img/home/{{ $ctrl.recipe.mainImageUrl }}" />` to the template.

But we are creating an image switcher so we will create a new function in the recipe-detail.component:

```
self.setImage = function (imageUrl) {
      self.mainImageUrl = imageUrl;
};
```

Followed by a call to the function in the promise function to initialize the first image:

`self.setImage(self.recipe.images[0]);`

And make the following change to the template, adding a class for styling and a source which uses the `mainImageUrl` variable we created in the controller:

`<img ng-src="img/home/{{$ctrl.mainImageUrl}}" class="recipe-detail-image" />`

(Note: we don't need `"mainImageUrl": "img/home/lasagna-1.png",` in the json since we are now refering to the images array.)

Add a list of images to the template that we will click on to swap out the main image. Note the `ng-click` directive and its call to the setImage function we created earlier:

```html
<ul class="recipe-thumbs">
    <li ng-repeat="img in $ctrl.recipe.images">
        <img ng-src="img/home/{{img}}" ng-click="$ctrl.setImage(img)" />
    </li>
</ul>
```
We should now be able to click on one of the images in the list to swap out the main image but we need some formatting.

Refactored:

```js
angular.module('recipeDetail').component('recipeDetail', {
  templateUrl: 'js/recipes/recipe-detail.template.html',

  controller: function RecipeDetailController($http, $routeParams) {
    $http.get('data/' + $routeParams.recipeId + '.json')
      .then(response => {
        this.recipe = response.data;
        this.setImage(this.recipe.images[0]);
      });
    this.setImage = (imageUrl) => this.mainImageUrl = imageUrl;
  }

});
```
 
###Navbar

Using: ng-class

Create a new controller in foodapp.module.js:

```js
app.controller('NavController', function ($scope, $location) {
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  };
})
```

Comment out all js in scripts.js

Add controller to the nav:

`<nav ng-controller="NavController">`

Edit one panel

```js
<div class="panel panel1" ng-class="{ active: isActive('/') }">
```

If this works then edit the entire navbar:

```html
<nav ng-controller="navApp">
  <div class="panels">
    <div class="panel panel1" ng-class="{ active: isActive('/') }">
      <a href="/">Home</a>
    </div>
    <div class="panel panel2" ng-class="{ active: isActive('/recipes') }">
      <a href="/recipes">Recipes</a>
    </div>
    <div class="panel panel3" ng-class="{ active: isActive('/reviews') }">
      <a href="/reviews">Reviews</a>
    </div>
    <div class="panel panel4" ng-class="{ active: isActive('/delivery') }">
      <a href="/delivery">Delivery</a>
    </div>
    <div class="panel panel5" ng-class="{ active: isActive('/about') }">
      <a href="/about">About</a>
    </div>
  </div>
</nav>
  ```















