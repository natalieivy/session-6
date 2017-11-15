# Session 5

<!-- ##Homework

Review the creation of components below. 

1. Add an Angular route for the reviews section of the page.
1. Create a component for the review page along with a 
1. template that displays 4 or 5 one sentence summary reviews (restaurant images are provided in the img directory if you would like to use them)
1. Bonus - make a nice 404 page for the other items on the main nav

Good luck. -->

## Components

Set up a simple html page bootstrapped with Angular (code.angularjs.org):

```html
<!DOCTYPE html>
<html>

<head>
    <title>AngularJS Module</title>
    <script src="https://code.angularjs.org/1.6.2/angular.js"></script>
    <script src="test.js"></script>
</head>

<body>
    <div ng-app="myApp">
        <div ng-controller="GreetUserController">
            <p>Hello {{ user }}</p>
        </div>
    </div>
</body>
</html>
```

test.js:

```js
angular.module('myApp', []);

angular.module('myApp').controller('GreetUserController', function( $scope ){
    $scope.user = 'John'
})
```

refactored:

```js
var myApp = angular.module('myApp', []);

myApp.controller('GreetUserController', $scope  =>  $scope.user = 'John' )
```

### Create a component

(Comment out the controller.) Components are referenced directly in the html via custom tags:

```html
<div ng-app="myApp">
  <greet-user></greet-user>
</div>
```

A component references an object that contains both a template and a controller. 

Note the use of $ctrl for components as opposed to global $scope. Here the data is exclusive to a specific controller. Also, the html uses hyphens while the component uses camel case.

```js
var myApp = angular.module('myApp', []);

myApp.component('greetUser', {
    template: 'Hello, {{ $ctrl.user }}!',
    controller: function GreetUserController() {
        this.user = 'world';
    }
});
```

Test in browser.

### Create multiple components:

Add a second component: 

```js
myApp.component('greetUser', {
    template: 'Hello, {{ $ctrl.user }}!',
    controller: function GreetUserController() {
        this.user = 'world';
    }
});


myApp.component('byeUser', {
    template: 'Bye, {{$ctrl.user}}!',
    controller: function ByeUserController() {
        this.user = 'cruel world';
    }
});
```

```html
<body>
    <div ng-app="myApp">
        <greet-user></greet-user>
        <bye-user></bye-user>
    </div>
</body>
```


### Add routing

(Comment out the previous components.) If we want to swap out components we use Angular for routing a SPA, not express routing. 

Use express routes for handling data and authentication. (Always include a single route for index.html.) 

e.g. something like this would be a bad idea:

```js
app.get('/recipes', (req, res) => {
    res.sendFile(__dirname + '/public/recipes.html')
})
```

Routing in a spa is best done using the hash structure (no page refresh).

Angular routes handle the view (templates) and the logic (controllers) for the views.

`<script src="https://code.angularjs.org/1.6.2/angular-route.js"></script>`

```js
var myApp = angular.module('myApp', ['ngRoute']);
```

```js
myApp.config(
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

myApp.controller('GreetUserController', function($scope){
    $scope.user = 'world';
})

myApp.controller('ByeUserController', function($scope){
    $scope.user = 'cruel world';
})
```

Because we are not using components we are back to using $scope.

ng-view

```html
<div ng-app="myApp">
    <div ng-view></div>
</div>
```

Note the url string now includes the hash and a bang ('!'). 

Go to `http://localhost:3000/#!/bye`

### Add Components

(Comment out the previous controllers. Uncomment the old components.) The routing specifies a template defined by a component.

Hash prefixes and be set using $locationProvider (defaults to !).

```js
var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(
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

myApp.component('greetUser', {
    template: 'Hello, {{$ctrl.user}}!',
    controller: function GreetUserController() {
        this.user = 'world';
    }
});

myApp.component('byeUser', {
    template: 'Bye, {{$ctrl.user}}!',
    controller: function ByeUserController() {
        this.user = 'cruel world';
    }
});
```

### Linking

```js
myApp.component('greetUser', {
    template: `
    <h4>Hello, {{ $ctrl.user }}!</h4>
    <p><a href="#!/bye">Bye</a></p>
    `,
    controller: function GreetUserController() {
        this.user = 'world';
    }
});
```
html5 mode is an alternative to hashbang mode. See [this discussion](http://stackoverflow.com/questions/16677528/location-switching-between-html5-and-hashbang-mode-link-rewriting#16678065) on stack overflow.

In the config:

Comment out `// $locationProvider.hashPrefix('!')`

`$locationProvider.html5Mode(true);`

In index.html:

`<base href="/">`

Note the cleaner urls.


## Recipe Site

Examine package.json, app.js, index.html and scripts.js

`sudo npm install`

`npm run boom!`

Allow express to use public as a source for static files and our Angular work:

`app.use(express.static('public'))`

`<script src="https://code.angularjs.org/1.5.8/angular.js"></script>`

`<body ng-app="foodApp">`

Create `foodapp.module.js`

`var app = angular.module('foodApp', []);`

and link it: `<script src="js/foodapp.module.js"></script>`

Create recipes folder in js.

Create `recipe-list.component.js` and link it.

```js
angular.module('foodApp').component('recipeList', {
    template: `<h1>test</h1>`,
    controller: function RecipeListController() {

    }
});
```

```html
<div>
  <recipe-list></recipe-list>
</div>
```

Debug!

Add a template and data to the controller:

```js
angular.module('foodApp').component('recipeList', {
  template:
  `
  <div>
  <ul>
      <li ng-repeat="recipe in $ctrl.recipes">
          <img ng-src="img/home/{{ recipe.image }}">
          <h1><a href="#0">{{ recipe.title }}</a></h1>
          <p>{{ recipe.description }}</p>
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

Break down the template into a separate file:

js > recipes > recipe-list.template.html

`templateUrl: 'js/recipes/recipe-list.template.html',`

### Format the recipes

```html
<div class="wrap">
    <ul>
        <li ng-repeat="recipe in $ctrl.recipes">
            <img ng-src="img/home/{{ recipe.image }}">
            <div>
            <h1><a href="#0">{{ recipe.title }}</a></h1>
            <p>{{ recipe.description }}</p>
            </div>
        </li>
    </ul>
</div>
```

styles.scss:

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

### Routing

Wire up the main nav. In the html:

`<script src="https://code.angularjs.org/1.6.2/angular-route.js"></script>`

`<script src="js/foodapp.config.js"></script>`

`<base href="/">`

In the module:

`angular.module('foodApp', ['ngRoute']);`

foodapp.config.js:

```js
angular.module('foodApp').config(

  function config($locationProvider, $routeProvider) {
    $routeProvider.
    when('/', {
      template: 'test'
    }).
    when('/recipes', {
      template: 'test2'
    }).
    otherwise('/404');

    $locationProvider.html5Mode(true);
  });
  ```

```html
<div>
  <div ng-view></div>
</div>
```

```html
<div class="panel panel1">
    <a href="/">Home</a>
</div>
<div class="panel panel2 active">
    <a href="/recipes">Recipes</a>
</div>
```

```js
angular.module('foodApp').config(

  function config($locationProvider, $routeProvider) {
    $routeProvider.
    when('/', {
      template: 'test'
    }).
    when('/recipes', {
      template: '<recipe-list></recipe-list>'
    }).
    otherwise('/404');

    $locationProvider.html5Mode(true);
  });
```

### Filtering and Sorting (optional)

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

`<li ng-repeat="recipe in $ctrl.recipes | filter:$ctrl.query | orderBy:$ctrl.orderProp">`

`this.orderProp = 'date';`


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


















