// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

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
      .state('login', {
        url: '/login',
        templateUrl: '/templates/login.html',
        controller: 'loginCtrl'
      })
      .state('menu', {
          url: "/map",
          abstract: true,
          templateUrl: "/templates/menu.html"
      })
      .state('menu.groups', {
          url: '/groups',
          views: {
              'menuContent': {
                  templateUrl: '/templates/groups.html'
              }
          }
      })
      .state('menu.group', {
          url: "/group/:groupId",
          views: {
              'menuContent': {
                  templateUrl: "templates/group.html"
              }
          }
      })
      .state('menu.races', {
          url: '/races',
          views: {
              'menuContent': {
                  templateUrl: '/templates/races.html'
              }
          }
      })
      .state('menu.race', {
          url: "/race/:groupId",
          views: {
              'menuContent': {
                  templateUrl: "templates/race.html"
              }
          }
      })
      .state('menu.profile', {
          url: '/profile',
          views: {
              'menuContent': {
                  templateUrl: '/templates/profile3.html'
              }
          }
      })
      .state('menu.logout', {
          url: '/logout',
          views: {
              'menuContent': {
                  templateUrl: '/templates/logout.html'
              }
          }
      })
      .state('menu.crono', {
          url: '/crono',
          views: {
              'menuContent': {
                  templateUrl: '/templates/crono.html'
              }
          }
      })
      .state('menu.stats', {
          url: '/stats',
          views: {
              'menuContent': {
                  templateUrl: '/templates/stats.html'
              }
          }
      });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
