#Session 6 - placeholder

###Search / Sort Filter

Add a search input field to the top of `recipe-list.template.html`. Note the use of [ng-model](https://docs.angularjs.org/api/ng/directive/ngModel):

```
<p>
  Search: <input ng-model="$ctrl.query" />
</p>
```

Add a filter to the ng-repeat directive:

`<li ng-repeat="recipe in $ctrl.recipes | filter:$ctrl.query">`

Data-binding is one of the core features in Angular. When the page loads, Angular binds the value of the input box to the data model variable specified with ngModel and keeps the two in sync.

The data that a user types into the input box (bound to $ctrl.query) is immediately available as a filter input in the list repeater (`recipe in $ctrl.recipes | filter:$ctrl.query`). When changes to the data model cause the repeater's input to change, the repeater updates the DOM to reflect the current state of the model.

The [filter](https://docs.angularjs.org/api/ng/filter/filter) function uses the `$ctrl.query` value to create a new array that contains only those records that match the query.

###Two Way Data Binding

Add a `<select>` element bound to `$ctrl.orderProp` to the top paragraph, so that our users can pick from the two provided sorting options.

```
  Sort by:
  <select ng-model="$ctrl.orderProp">
    <option value="title">Alphabetical</option>
    <option value="date">Newest</option>
  </select>
```
Note the values - these are from the json.

Chained the filter filter with the orderBy filter to further process the input for the repeater. 

[`orderBy`](https://docs.angularjs.org/api/ng/filter/orderBy) is a filter that takes an input array, copies it and reorders the copy which is then returned.

`<li ng-repeat="recipe in $ctrl.recipes | filter:$ctrl.query | orderBy:$ctrl.orderProp">`

Add a line to the controller in `recipe-list.component.js` after the recipes array that sets the default value of orderProp to age. If we had not set a default value here, the orderBy filter would remain uninitialized until the user picked an option from the drop-down menu.

`this.orderProp = 'date';`



###Fetching the Data

Let's use `recipes.json` in the data folder instead of keeping the data model in the controller. 

We fetch the dataset from our server using one of Angular's built-in services called [$http](https://docs.angularjs.org/api/ng/service/$http). We will use Angular's [dependency injection (DI)](https://docs.angularjs.org/guide/di) to provide the service to the recipeList component's controller.

$http
* a core Angular service that facilitates communication with the remote HTTP servers
* core = built into Angular
* need to make it available to our controller via [dependency injection](https://docs.angularjs.org/guide/di).

In `recipe-list.component.js` make $http available to the controller:

`controller: function RecipeListController($http) { `

Create var `self` - since we are making the assignment of the recipes property in a callback function (`.then(function (response) {}`), where the `this` value is not defined, we introduce a local variable called self that points back to the RecipeListController.

```js
controller: function RecipeListController($http) {
    var self = this;
```

Change the orderProp statement to refer to self:

```js
self.orderProp = 'date';
```

Use `get` method of `$http` to fetch the json from the data folder:

```js
$http.get('data/recipes.json').then(function (response) {
    self.recipes = response.data;
});
```

* `then` is a promise which runs the following function when the data is received (the `response`):
* since we want the `response.data` to belong to the RecipeListController function we assign it to `self.recipes`.

We should see no change to the view but the data is now being accessed via http from the data folder.

Here is the complete component:

```js
angular.module('recipeApp').component('recipeList', {
    templateUrl: 'recipe-list/recipe-list.template.html',

    controller: function RecipeListController($http) {
        var self = this;
        self.orderProp = 'date';

        $http.get('data/recipes.json').then(function (response) {
            self.recipes = response.data;
        });
    }
});
```
###Promises

```js
<script>
console.log('fetching data from beers - like $.getJSON or $.ajax')
const posts = fetch('https://api.punkapi.com/v2/beers/'); 
console.log(posts)
</script>
```
Returns a promise

```js
const postsPromise = fetch('https://api.punkapi.com/v2/beers/'); 
postsPromise.then(data => {
  console.log(data)
})
```

Returns a readable stream

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

To add the detailed view, we are going to turn index.html into a "layout template" - a template that is common to all views in our application. Other "partial templates" are then included into this layout template depending on the "route" — the view that is currently displayed to the user.

Note the addition of recipe1309.json to the data directory. 

Use the `recipe.name` expression in the html template:

`<h1><a href="#!recipes/{{ recipe.name }} ">{{ recipe.title }}</a></h1>`

Note we are hard coding `#!recipes/` and accessing recipe.name from the json. Also, the hash bang. Now, clicking on the individual recipe shows a new address in the browser's location bar. (Resist the temptation to use the navbar on the top of the document for now. It is not part of the angular application.)

Add ngRoute to index.html after the main angular load:

`<script src="https://code.angularjs.org/1.5.8/angular-route.js"></script>`

A module's .config() method gives us access to the available providers for configuration. To make the providers, services and directives defined in ngRoute available to our application, we need to add ngRoute as a dependency to our recipeApp module.

Add `ngRoute` as a dependency for our app-module.js:

```
angular.module('recipeApp', [
    'ngRoute',
    'recipeList'
]);
```

Application routes in Angular are declared via $routeProvider, which is the provider of the $route service. This service makes it easy to wire together controllers, view templates, and the current URL location in the browser. 

We can configure the $route service (using it's provider) for our application. In order to be able to quickly locate the configuration code, we put it into a separate file and used the .config suffix.

Create an app.config file in the app folder:
```js
angular.module('recipeApp').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');
            $routeProvider.
                when('/', {
                    template: '<recipe-list></recipe-list>'
                }).
                when('/recipes/:recipeId', {
                    template: '<recipe-detail></recipe-detail>'
                }).
                otherwise('/recipes');
        }
    ]);
```

Alt version without min protection:

```js
angular.module('recipeApp').config(
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.
        when('/', {
            template: '<recipe-list></recipe-list>'
        }).
        when('/recipes/:recipeId', {
            template: '<recipe-detail></recipe-detail>'
        }).
        otherwise('/recipes');
    });
```

* `otherwise` - defines a fallback route to redirect to, when no route definition matches the current URL
* `:recipeId` - the $route service uses the route declaration — '/phones/:recipeId' — as a template that is matched against the current URL. All variables defined with the : prefix are extracted into the (injectable) $routeParams object.

Add a link to `app.config.js` to index.html (after the app.module.js):

`<script src="app.config.js"></script>`

We optionally used $locationProvider.hashPrefix() to set the hash-prefix (`#`) to !. This prefix will appear in the links to our client-side routes, right after the hash (`#`) symbol and before the actual path (e.g. index.html#!/some/path).

Setting a prefix is not necessary, but it is considered a good practice. ! is the most commonly used prefix. The recipe-template included the `!`:

```html
<h1><a href="#!recipes/{{ recipe.name }} ">{{ recipe.title }}</a></h1>
```

Edit index.html from:

```html
<article ng-app="recipeApp">
    <recipe-list></recipe-list>
</article>
```

To:

```html
<article ng-app="recipeApp">
    <div ng-view></div>
</article>
```

Routing is usually used in conjunction with ngView - a directive that complements the $route service by including the rendered template of the current route into the main layout. The ngView directive includes the view template for the current route into the layout template. 

Here we see nothing when we click on a recipe. That is because there is no defined view associated with the detail route.

The config file makes provision for a recipe-detail template. We will create that now.




###Creating the Recipe Details Component

Create a `recipe-detail` directory in the app folder.

Create stubs for recipe details in the new `recipe-detail` directory:

`recipe-detail/recipe-detail.module.js`:

```
angular.module('recipeDetail', [
    'ngRoute'
]);
```

We inject ngRoute into the recipeDetail module since we will be needing it.

We can then inject the routeParams service of ngRoute into our controller so that we can extract the recipeId.

`recipe-detail.component.js`

```
angular.module('recipeDetail').
    component('recipeDetail', {
        template: '<p>Detail view for <span>{{$ctrl.recipeId}}</span></p>',
        controller: ['$routeParams',
            function RecipeDetailController($routeParams) {
                this.recipeId = $routeParams.recipeId;
            }
        ]
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
    <script src="recipe-detail/recipe-detail.module.js"></script>
    <script src="recipe-detail/recipe-detail.component.js"></script>
    ...
</head>
```

Clicking on the recipe links in the main view should take you to our stub template. Note: because of the order we used to create this module you may need to restart gulp.



###Adding JSON and the Detail Template

Review `data/recipe1309.json`:

```js
{
  "name": "recipe1309", 
  "title": "Lasagna", 
  "date": "2013-09-01", 
  "description": "Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.", 
  "mainImageUrl": "img/home/lasagna-1.png",
  "images": ["lasagna-1.png","lasagna-2.png","lasagna-3.png","lasagna-4.png"],

  "ingredients": ["lasagna pasta", "tomatoes", "onions", "ground beef", "garlic", "cheese"]
}
```

Create `recipe-detail/recipe-detail.template.html`

```html
<div itemscope itemtype="http://schema.org/Recipe">

    <h2>{{ $ctrl.recipe.title }}</h2>

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
angular.module('recipeDetail').component('recipeDetail', {
        templateUrl: 'recipe-detail/recipe-detail.template.html',
        controller: ['$routeParams',
            function RecipeDetailController($routeParams) {
                this.recipeId = $routeParams.recipeId;
            }
        ]
    });
```

Add $http to the dependancy list for our controller so we can access the json via http and create a variable `self` to point to the controller. 

We use the `self` variable in the response function to make the data available to the controller (variable scope).

```js
angular.module('recipeDetail').component('recipeDetail', {
    templateUrl: 'recipe-detail/recipe-detail.template.html',
    controller: ['$http', '$routeParams',
        function RecipeDetailController($http, $routeParams) {
            var self = this;

            $http.get('data/' + $routeParams.recipeId +  '.json').then(function(response){
                self.recipe = response.data;
            });
        }
    ]
});
```


##Adding an Image Swapper

To finish this exercise we will implement an image switcher similar to the one we created in earlier lessons but using our recipe-details.component.

Set the html template for the detail view to show one main image using this portion of the json: `"mainImageUrl": "img/home/lasagna-1.png",`

To get an image to display we add: `<img ng-src="{{ $ctrl.recipe.mainImageUrl }}" />` to the template.

But we are creating an image switcher so we will create a new function in the recipe-detail.component:

```
self.setImage = function setImage(imageUrl) {
      self.mainImageUrl = imageUrl;
};
```

Followed by a call to the function in the promise function to initialize the first image:

`self.setImage(self.recipe.images[0]);`

And make the following change to the template, adding a class for styling and a source which uses the `mainImageUrl` variable we created in the controller:

`<img ng-src="img/home/{{$ctrl.mainImageUrl}}" class="recipe-detail-image" />`

(Note: we don't need `"mainImageUrl": "img/home/lasagna-1.png",` in the json since we are now refering to the images array.)

Add a list of images to the template that we will click on to swap out the main image. Note the `ng-click` directive and its call to the setImage function we created earlier:

```
<ul class="recipe-thumbs">
    <li ng-repeat="img in $ctrl.recipe.images">
        <img ng-src="img/home/{{img}}" ng-click="$ctrl.setImage(img)" />
    </li>
</ul>
```
We shoud now be able to click on one of the images in the list to swap out the main image but we need some formatting.


###SASS

Add sass to `_recipes.scss` to control the display of the main image:

```css
.recipe-detail-image {
    margin-top: 1rem;
}
.recipe-thumbs {
    width: 100%;
    margin: 1rem 0;
    display: flex;
    img {
        padding: 0 0.5rem;
    }
}

```

 
















