'use strict';

angular.module('surveyorApp.controllers.header', ['surveyorApp.services.login'])
  .controller('HeaderController', ['$scope', '$location', 'loginService', 'angularFire', 'FBURL', 
    function($scope, $location, loginService, angularFire, FBURL) {

      $scope.$on("angularFireAuth:login", function() {

      });

      $scope.logout = function() {
        loginService.logout('/signin');
      };

      $scope.navbarEntries = [
      ];
    }])