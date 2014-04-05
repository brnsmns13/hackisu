'use strict';

angular.module('surveyorApp.controllers.header', ['surveyorApp.services.login'])
  .controller('HeaderController', ['$scope', '$location', 'loginService', 'angularFire', 'FBURL', 
    function($scope, $location, loginService, angularFire, FBURL) {

      $scope.$on("angularFireAuth:login", function() {
          angularFire(new Firebase(FBURL+'/users/'+$scope.auth.id), $scope, 'user');
      });

      $scope.logout = function() {
        loginService.logout('/signin');
      };

      $scope.navbarEntries = [
          {
              "title": "YourSurveys",
              "link": "/surveys"
          },
          {
              "title": "AddSurveys",
              "link": "/addsurvey"
          }
      ];
    }])