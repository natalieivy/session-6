# Session 6

## Homework

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
> exit
```
Do a clean exit of mongod by closing the terminal tab.

If you need help setting the permissions on the db folder [see this post](http://stackoverflow.com/questions/28987347/setting-read-write-permissions-on-mongodb-folder).

<!-- ## Homework

Review the creation of the details page. 

1. Add at least two detail pages to last week's homework
1. Include an image switcher
1. Include a filter and view toggle for the master page
1. Tidy up the view using SASS -->

<!-- # Session 5 -->

<!-- ##Homework

Review the creation of components below. 

1. Add an Angular route for the reviews section of the page.
1. Create a component for the review page along with a 
1. template that displays 4 or 5 one sentence summary reviews (restaurant images are provided in the img directory if you would like to use them)
1. Bonus - make a nice 404 page for the other items on the main nav

Good luck. -->

## Setup

Git - save the current state, create a new branch `components-sample`

Review the manifest. 

cd into the myapp directory and: 

`npm install`

`npm run boom!`

Test the babel and webpack by adding (in myapp.js):

```js
alert('hey')

const panels = document.querySelectorAll('.panel')
const triggers = document.querySelectorAll('a')

function toggleOpen(){
  closePanels()
  this.classList.toggle('active')
}

function closePanels(){
  panels.forEach( (panel) => panel.classList.remove('active'))
}

panels.forEach( (panel) => panel.addEventListener('click', toggleOpen))
```

## Angular

Be sure to halt any processes running in the terminal before installing.

```bash
npm install angular@1.6.2 --save
npm install angular-route@1.6.2 --save
```

import it and a new nav.js file into myapp.js

```
import angular from 'angular'
import navjs from './nav'
```

Test Angular

In index.html:

```html
<div class="wrap" ng-app=myApp >
  <div ng-controller="myCtrl">
    Name: <input ng-model="name">
  </div>
</div>
```

In myapp.js

```js
const app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
  $scope.name = "John Doe";
});
```

Refactored:

```js
app.controller('myCtrl', $scope => $scope.name = "John Doe")
```

### Add routing

Add routing to our bundle:

```js
import angular from 'angular'
import ngRoute from 'angular-route'
import navjs from './nav'
```

This supplants express routes for handling views. (Always include a single route for index.html.) 

e.g. we will not be doing this:

```js
app.get('/recipes', (req, res) => {
    res.sendFile(__dirname + '/public/recipes.html')
})
```

Angular routes handle the view (templates) and the logic (controllers) for the views.

myapp.js:

```js
const app = angular.module('myApp', ['ngRoute']);
```

```js
import angular from 'angular'
import ngRoute from 'angular-route'
import navjs from './nav'

const app = angular.module('myApp', ['ngRoute']);

app.config(
    function config($routeProvider) {
        $routeProvider.
        when('/', {
            template: 'Hello, {{user}}!',
            controller: 'GreetUserController'
        }).
        when('/bye', {
            template: 'Bye, {{user}}!',
            controller: 'ByeUserController'
        }).
        otherwise('/404');
    });

app.controller('GreetUserController', function($scope){
    $scope.user = 'world';
})

app.controller('ByeUserController', function($scope){
    $scope.user = 'cruel world';
})
```

ng-view in index.html

```html
<div ng-app="myApp">
    <div ng-view></div>
</div>
```

Note the url string now includes the hash and a bang ('!'). 

Go to `http://localhost:3000/#!/bye`

Hash prefixes and be set using $locationProvider (defaults to !).

### Add Components

Use named components my moving from `app.controller` to `app.component` and using custom tags.

E.g. from separate templates and controllers:

```js
when('/', {
    template: 'Hello, {{user}}!',
    controller: 'GreetUserController'
}).
```

to custom tags:

```js
when('/', {
    template: '<greet-user></greet-user>'
}).
```

Edit the Angular routing to use modules:

```js
app.config(
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
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
    template: 'Hello, {{$ctrl.user}}!',
    controller: function GreetUserController() {
        this.user = 'world';
    }
});

app.component('byeUser', {
    template: 'Bye, {{$ctrl.user}}!',
    controller: function ByeUserController() {
        this.user = 'cruel world';
    }
});
```

Add some formatting with template strings :

```js
app.component('greetUser', {
    template: `<div class="wrap">Hello, {{$ctrl.user}}!</div>`,
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
```

and set the navigation:

```html
  <nav>
    <div class="panels">
      <div class="panel panel1 active">
        <a href="/">Home</a>
      </div>
      <div class="panel panel2">
        <a href="#!/bye">Recipes</a>
      </div>
```

### Location and Prefixing

Add a link to the `bye` page:

```js
app.component('greetUser', {
    template: `
    <div class="wrap">
      <h4>Hello, {{ $ctrl.user }}!</h4>
      <p><a href="#!/bye">Bye</a></p>
    </div>`,
    controller: function GreetUserController() {
        this.user = 'world';
    }
});
```

html5 mode is an alternative to hashbang mode. 

In the config:

Comment out `// $locationProvider.hashPrefix('!')`

Add:

`$locationProvider.html5Mode(true);`

Add in the head of index.html:

`<base href="/">`

Be sure to change to link in the component:

```js
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
```

Note the clean urls.

Correct app.js routes by commenting out the generator routes and using:

```js
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
});
```

### Navbar

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

Comment out all the panel related js in scripts.js:

```js
// const panels = document.querySelectorAll('.panel')
// const triggers = document.querySelectorAll('a')

// function toggleOpen(){
//  closePanels()
//  this.classList.toggle('active')
// }

// function closePanels(){
//  panels.forEach( (panel) => panel.classList.remove('active'))
// }

// panels.forEach( panel => panel.addEventListener('click', toggleOpen))
```

Add controller to the nav:

`<nav ng-controller="NavController">`

Edit one panel

```html
<div class="panel panel1" ng-class="{ active: isActive('/') }">
```

If this works then edit the entire navbar using this pattern:

```html
<nav ng-controller="NavController">
  <div class="panels">
    <div class="panel panel1" ng-class="{ active: isActive('/') }">
      <a href="/">Home</a>
    </div>
    <div class="panel panel2" ng-class="{ active: isActive('/bye') }">
      <a href="/bye">Recipes</a>
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

Git - save the current state, create a new branch `foodapp`

### END Components Sample


## Recipe Site

Let's create a component based site with recipes.

Remove the existing Angular in index.html and add:

`<body ng-app="foodApp">`

```html
<div>
  <recipe-list></recipe-list>
</div>
```

Remove the Angular material from myapp.js and add:

`var app = angular.module('foodApp', []);`

Create the first component:

```js
var app = angular.module('foodApp', []);

app.component('recipeList', {
    template: `<div class="wrap"><h1>test</h1></div>`,
    controller: function RecipeListController() {

    }
});
```

Add a template and data to the controller:

```js
var app = angular.module('foodApp', []);

app.component('recipeList', {
  template:
  `
  <div class="wrap">
    <ul>
      <li ng-repeat="recipe in $ctrl.recipes">
        <img ng-src="images/home/{{ recipe.image }}">
        <div>
          <h1><a href="#0">{{ recipe.title }}</a></h1>
          <p>{{ recipe.description }}</p>
        </div>
      </li>
    </ul>
  </div>
  `,

  controller: function RecipeListController( ) {
    this.recipes = [
    {
      name: 'recipe1309',
      title: 'Lasagna',
      date: '2013-09-01',
      description: 'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
      image: 'lasagne.png'
    },
    {
      name: 'recipe1404',
      title: 'Pho-Chicken Noodle Soup',
      date: '2014-04-15',
      description: 'Pho (pronounced “fuh”) is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: 'pho.png'
    },
    {
      name: 'recipe1210',
      title: 'Guacamole',
      date: '2012-10-01',
      description: 'Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor – with this authentic Mexican guacamole recipe, though, you will be an expert in no time.',
      image: 'guacamole.png'
    },
    {
      name: 'recipe1810',
      title: 'Hamburger',
      date: '2012-10-20',
      description: 'A Hamburger (or often called as burger) is a type of food in the form of a rounded bread sliced in half and its Center is filled with patty which is usually taken from the meat, then the vegetables be lettuce, tomatoes and onions.',
      image: 'hamburger.png'
    }
    ];
  }
});
```

Move the template into a separate file in a new folder:

`public > includes > recipes.html`

Edit the template declaration in myapp.js:

`templateUrl: '/includes/recipes.html',`

### Format the recipes

```
@import 'imports/recipe-list'; 
```

recipes.scss

```css
.wrap {
    background: #eee;
    max-width: 940px;
    margin: 0 auto;
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        display: flex;
        padding: 1rem;
        img {
            width: 30%;
            height:100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            margin-right: 1rem;
        }
        h1 {
            font-family: lobster;
            a {
                color: #666;
                text-decoration: none;
            }
        }
    }
}
```

### Routing and Multiple Components

Wire up the main nav. 

Inject ngRoute into the module:

`var app = angular.module('foodApp', ['ngRoute']);`

Our first Angular route:

```js
app.config(
  function config($locationProvider, $routeProvider) {
    $routeProvider.
    when('/', {
      template: 'recipe-list'
    })
    $locationProvider.html5Mode(true);
  });
```

Currently, the html has the component hard coded:

```html
  <div>
    <recipe-list></recipe-list>
  </div>
```

We use the `ng-view` directive to alow it to use whatever module we pass into it:

```html
<div>
  <div ng-view></div>
</div>
```

And add the template to our Angular route:

```js
app.config(
  function config($locationProvider, $routeProvider) {
    $routeProvider.
    when('/', {
      template: '<recipe-list></recipe-list>'
    })
    $locationProvider.html5Mode(true);
  });
```

Add an additional route to our config:

```js
app.config(
  function config($locationProvider, $routeProvider) {
    $routeProvider.
    when('/', {
      template: '' 
    }).
    when('/recipes', {
      template: '<recipe-list></recipe-list>'
    })
    $locationProvider.html5Mode(true);
  });
```

Make a small change to our html:

```html
<div class="panel panel1">
    <a href="/">Home</a>
</div>
<div class="panel panel2 active">
    <a href="/recipes">Recipes</a>
</div>
```


### $HTTP

Let's use `recipes.json` in the data folder instead of keeping the data model in the controller. 

We fetch the dataset from our server using one of Angular's built-in [$http](https://docs.angularjs.org/api/ng/service/$http) service.

$http:
* a core (built into Angular) service that facilitates communication with the remote HTTP servers
* need to make it available to the recipeList component's controller via [dependency injection](https://docs.angularjs.org/guide/di).

Make $http available to the controller:

`controller: function RecipeListController($http) { ...`

Use `get` method with `$http` to fetch the json from the data folder:

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
    ...
  }
```

Here is the complete component:

```js
app.component('recipeList', {
  templateUrl: '/includes/recipes.html' ,

  controller: function RecipeListController( $http ) {
    var self = this;
    $http.get('data/recipes.json')
    .then(function (response) {
        self.recipes = response.data;    when('/recipes', {
      template: '<recipe-list></recipe-list>'
    })
    });
  }
});
```

Another solution is to use Arrow functions which avoid the 'this' problem. No need for a self variable. 

See `_arrow-functions`

```js
app.component('recipeList', {
  templateUrl: '/includes/recipes.html',
  controller: function RecipeListController($http) {
    $http.get('data/recipes.json').then( response => this.recipes = response.data)
  }
})
```

### then

* `then` is a promise which runs the following function when the data is received (the `response`)

### Filtering and Sorting (optional)

Add to the template:

```html
<ul>
    <li>
        <p>
            Search: <input ng-model="$ctrl.query" />
        </p>
        <p>
            Sort by:
            <select ng-model="$ctrl.orderProp">
                <option value="title">Alphabetical</option>
                <option value="date">Newest</option>
            </select>
        </p>
    </li>
</ul>
```

Edit the ng-repeat:

`<li ng-repeat="recipe in $ctrl.recipes | filter:$ctrl.query | orderBy:$ctrl.orderProp">`

Add to the controller:

`this.orderProp = 'date';`

### Promises

see index.html in the promises folder:

```html
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

```js
const postsPromise = fetch('https://api.punkapi.com/v2/beers/'); 

postsPromise
  .then(data => data.json())
  .then(data => { console.log(data) })
```

.then fires when there is a successful result. Listen for errors using .catch

```js
const postsPromise = fetch('https://api.punkapi.com/v2/beers/'); 

postsPromise
  .then(data => data.json())
  .then(data => { console.log(data) })
  .catch((err) => {
    console.error(err);
  })
```

(Create an error by mangling the fetch URI.)

##### Custom Promises

See 2-custom-promise.html

##### Chaining (waterfall) Promises

See 3-chaining-promises.html

##### Multiple Promises

4-multiple-promises.html

### Adding Routing to Display Individual Recipes

Note the addition of recipe1309.json to the data directory. 

Use the json's `recipe.name` expression in the html template:

`<h1><a href="#!/recipes/{{ recipe.name }} ">{{ recipe.title }}</a></h1>`

Now, clicking on the individual recipe shows a 404 address in the browser's location bar since we do not have routes set up for these yet.

### Recall

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

Before we start, let's check that we are not stomping on Expressjs's routes.

Remove the current routes:

```js
// const routes = require('./routes/index');
// const users = require('./routes/users');
```

and add our own:

```js
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
```

Add a route in myapp.js for the new recipe links:

```js

      when('/recipes/:recipeId', {
        template: `<div class="wrap">Detail</div>`
      })

```

* `:recipeId` - the $route service uses the route declaration — '/recipes/:recipeId' — as a template that is matched against the current URL. 

All variables defined with the : prefix are extracted into the (injectable) $routeParams object.

Create a reference to the recipe-detail template:

```js
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
```


### Creating the Recipe Details Component

We inject the routeParams service of ngRoute into our controller so that we can extract the recipeId and use it in our stub.

<!-- `recipe-detail.component.js` -->

```js
app.component('recipeDetail', {
  template: '<div class="wrap">Detail view for {{$ctrl.recipeId}}</div>',

  controller: function RecipeDetailController($routeParams) {
    this.recipeId = $routeParams.recipeId;
  }

});
```

<!-- Link to recipe-detail files:

```
<head>
    ...
    <script src="/js/recipes/recipe-detail.component.js"></script>
    ...
</head>
``` -->

Clicking on the recipe links in the list view should take you to our stub template. 


### Adding JSON and the Detail Template

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

Create `recipe-detail.html`:

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
  templateUrl: '/includes/recipe-detail.html',
  ...
})
```

Add `$http` to the dependancy list for our controller so we can access the json via http"

`controller: function RecipeDetailController($http, $routeParams) {`

and use an arrow function to load the data: 

```js 
$http.get('data/' + $routeParams.recipeId +  '.json')
.then(response => this.recipe = response.data);
```


# END


## Adding an Image Swapper

Implement an image switcher within our recipe-details component.

Set the html template for the detail view to show one main image using this entry in recipe1309.json: `"mainImageUrl": "lasagna-1.png",`

Add to the template:

`<img ng-src="img/home/{{ $ctrl.recipe.mainImageUrl }}" />` 

We are creating an image switcher so we will create a new function in the recipe-detail component:

```js
self.setImage = function (imageUrl) {
      self.mainImageUrl = imageUrl;
};
```

Followed by a call to the function in the promise function to initialize the first image:

`self.setImage(self.recipe.images[0]);`

And make the following change to the template, adding a class for styling and a source which uses the `mainImageUrl` variable we created in the controller:

`<img ng-src="img/home/{{$ctrl.mainImageUrl}}" class="recipe-detail-image" />`

(Note: we no longer need `"mainImageUrl": "img/home/lasagna-1.png",` in the json since we are now refering to the images array.)

### ng-click

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


### Search / Sort Filter

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

### Two Way Data Binding

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
 
### Navbar

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

Comment out all the panel related js in scripts.js:

```js
// const panels = document.querySelectorAll('.panel')
// const triggers = document.querySelectorAll('a')

// function toggleOpen(){
//  closePanels()
//  this.classList.toggle('active')
// }

// function closePanels(){
//  panels.forEach( (panel) => panel.classList.remove('active'))
// }

// panels.forEach( panel => panel.addEventListener('click', toggleOpen))
```

Add controller to the nav:

`<nav ng-controller="NavController">`

Edit one panel

```html
<div class="panel panel1" ng-class="{ active: isActive('/') }">
```

If this works then edit the entire navbar using this pattern:

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




### Notes


```css
.highlight {
  transition: all 0.2s;
  position: absolute;
  top: 0;
  background: rgba(255,255,255,0.2);
  left: 0;
  z-index: 1;
  display: block;
  pointer-events: none 
  }
```

```js
const highlight = document.createElement('span');
highlight.classList.add('highlight');
document.body.append(highlight);

function highlightLink() {
  const linkCoords = this.getBoundingClientRect();
  const coords = {
      width: linkCoords.width,
      height: linkCoords.height,
      top: linkCoords.top + window.scrollY,
      left: linkCoords.left + window.scrollX
    };

    highlight.style.width = `${coords.width}px`;
    highlight.style.height = `${coords.height}px`;
    highlight.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
}

triggers.forEach(panel => panel.addEventListener('mouseenter', highlightLink));
```

```js
function highlightLink() {
  console.log(this)
}
```

```js
function highlightLink() {
  const linkCoords = this.getBoundingClientRect();
    console.log(linkCoords)
}
```

```js
function highlightLink() {
  const linkCoords = this.getBoundingClientRect();
    highlight.style.width = `${linkCoords.width}px`;
    highlight.style.height = `${linkCoords.height}px`;
}
```

```js
function highlightLink() {
  const linkCoords = this.getBoundingClientRect();
    highlight.style.width = `${linkCoords.width}px`;
    highlight.style.height = `${linkCoords.height}px`;
    highlight.style.transform = `translate(100px, 100px)`;
}
```



<nav ng-include=" 'includes/nav.html' "></nav>


```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Recipes</title>
  <script src="https://code.angularjs.org/1.6.2/angular.min.js"></script>
  <script src="https://code.angularjs.org/1.6.2/angular-route.js"></script>
  <script src="js/foodapp.module.js"></script>
  <script src="js/foodapp.config.js"></script>
  <script src="js/recipes/recipe-list.component.js"></script>

  <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">

  <base href="/">
</head>
<body ng-app="foodApp">
  <nav ng-include=" 'includes/nav.html' "></nav>
  <div ng-view></div>
  <script src="js/scripts.js"></script>
</body>
</html>
```















