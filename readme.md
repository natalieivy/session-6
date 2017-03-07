#Session 6

Food App Continued

##Homework

Review the creation of the details page. 

1. Add at least two detail pages to last week's homework
1. Include an image switcher
1. Tidy up the view using SASS


[Download and install](https://www.mongodb.com/download-center) the community edition of Mongodb. 
(Install instructions for [MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/))

Be sure to create a `/data/db/` directory at the top level of your hard drive.
Run `mongod` in a Terminal tab to start mongod.
Try running a few commands *in another tab* to ensure its functioning:

```sh
$ mongo
> show dbs
> use puppies
> db.createCollection('toys')
> show collections
> db.toys.insert({name: 'yoyo', color: 'red'})
> db.toys.find()
```

If you need help setting the permissions on the db folder [see this post](http://stackoverflow.com/questions/28987347/setting-read-write-permissions-on-mongodb-folder).

Good luck.

###$HTTP

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
        console.log(this.recipes)
    });
```

Note: in JavaScript you can nest functions, that is you can define functions inside functions. 

While nested functions capture variables defined in parent functions in a closure, they do not inherit `this`.

We are making the assignment of the recipes in a nested function (`.then(function (response) {}`), where the `this` value is not defined.

One Solution is to create a variable `self` - , we introduce a local variable called self that points back to the RecipeListController.

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

Another solution is to use Arrow functions which avoid the 'this' problem. No need for a self variable. 

See `_arrow-functions`

```js
angular.module('foodApp').component('recipeList', {
  templateUrl: 'js/recipes/recipe-list.template.html',
  controller: function RecipeListController($http) {
    $http.get('data/recipes.json').then( response => this.recipes = response.data)
  }
})
```

###then

* `then` is a promise which runs the following function when the data is received (the `response`)

###Promises

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

data is a readable stream. Since a stream can be any type a data (images, audio, text) we need to convert it.

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

A module's .config() method gives us access to tools for configuration. 

To make the providers, services and directives defined in ngRoute available to our application, we added ngRoute as a dependency to our foodApp module:

```js
angular.module('foodApp', [
    'ngRoute'
]);
```

Application routes in Angular are declared via $routeProvider. This service makes it easy to wire together controllers, view templates, and the current URL location in the browser. 

We can configure the $route service (using it's provider) for our application. 

In order to be able to quickly locate the configuration code, we put it into a separate file and used the .config suffix.

Add a route for the new recipe links:

```js

			when('/recipes/:recipeId', {
				template: `<div class="wrap">Detail</div>`
			}).

```

* `:recipeId` - the $route service uses the route declaration — '/recipes/:recipeId' — as a template that is matched against the current URL. 

All variables defined with the : prefix are extracted into the (injectable) $routeParams object.

Create a reference to the recipe-detail template:

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

We inject the routeParams service of ngRoute into our controller so that we can extract the recipeId and use it in our stub.

`recipe-detail.component.js`

```
angular.module('foodApp').component('recipeDetail', {
  template: '<div class="wrap">Detail view for {{$ctrl.recipeId}}</div>',

  controller: function RecipeDetailController($routeParams) {
    this.recipeId = $routeParams.recipeId;
  }

});
```

Link to recipe-detail files:

```
<head>
    ...
    <script src="/js/recipes/recipe-detail.component.js"></script>
    ...
</head>
```

Clicking on the recipe links in the list view should take you to our stub template. 


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

Create `js/recipes/recipe-detail.template.html`

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

Refactor to use an arrow function: 

```
$http.get('data/' + $routeParams.recipeId +  '.json')
.then(response => this.recipe = response.data);
```

##Adding an Image Swapper

Implement an image switcher using our recipe-details.component.

Set the html template for the detail view to show one main image using this entry in recipe1309.json: `"mainImageUrl": "lasagna-1.png",`

Add to the template:

`<img ng-src="img/home/{{ $ctrl.recipe.mainImageUrl }}" />` 

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

(Note: we no longer need `"mainImageUrl": "img/home/lasagna-1.png",` in the json since we are now refering to the images array.)

###ng-click

Add a list of images to the template that we will click on to swap out the main image. Note the `ng-click` directive and its call to the setImage function we created earlier:

```html
<ul class="recipe-thumbs">
    <li ng-repeat="img in $ctrl.recipe.images">
        <img ng-src="img/home/{{img}}" ng-click="$ctrl.setImage(img)" />
    </li>
</ul>
```
We should now be able to click on one of the images in the list to swap out the main image.

Final refactored component:

```js
angular.module('foodApp').component('recipeDetail', {
  templateUrl: 'js/recipes/recipe-detail.template.html',

  controller: function RecipeDetailController($http, $routeParams) {

     $http.get('data/' + $routeParams.recipeId +  '.json')
      .then(response => {
        this.recipe = response.data;
        this.setImage(this.recipe.images[2])
        });

      this.setImage = imageUrl => this.mainImageUrl = imageUrl;

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
<nav ng-controller="NavController">
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















