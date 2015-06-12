// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'login.controller', 'profile.controller',
                'stats.controller', 'maps.controller', 'logout.controller', 'crono.controller',
                'groups.controller', 'races.controller'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menuapk.html",
      controller: 'AppCtrl'
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: "templates/map.html",
          controller: 'GpsCtrl'
        }
      }
    })
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'loginCtrl'
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: "templates/profile3.html",
          controller: 'profileCtrl'
        }
      }
    })
    .state('app.stats', {
      url: '/stats',
      views: {
        'menuContent': {
          templateUrl: "templates/stats.html",
          controller: 'statsCtrl'
        }
      }
    })
    .state('app.races', {
      url: '/races',
      views: {
        'menuContent': {
          templateUrl: "templates/races.html",
          controller: 'RacesCtrl'
        }
      }
    })
    .state('app.race', {
      url: "/race/:parentId",
      views: {
        'menuContent': {
          templateUrl: "templates/messages.html",
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('app.groups', {
      url: '/groups',
      views: {
        'menuContent': {
          templateUrl: "templates/groups.html",
          controller: 'GroupsCtrl'
        }
      }
    })
    .state('app.group', {
      url: "/group/:parentId",
      views: {
        'menuContent': {
          templateUrl: "templates/messages.html",
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('app.userlist', {
      url: "/users/:parent/:parentId",
      views: {
        'menuContent': {
          templateUrl: "templates/userlist.html",
          controller: 'UserListCtrl'
        }
      }
    })
    .state('app.crono', {
      url: '/crono',
      views: {
        'menuContent': {
          templateUrl: "templates/crono.html"
        }
      }
    })
    .state('app.logout', {
      url: '/logout',
      views: {
        'menuContent': {
          templateUrl: "templates/logout.html",
          controller: 'logoutCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
