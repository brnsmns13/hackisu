'use strict';

angular.module('surveyorApp.controllers.signup', [])
  .controller('SignupCtrl', ['$scope', 'loginService', '$location',
    function($scope, loginService, $location) {

      $scope.$on('angularFireAuth:login', function () {
        $location.path('/');
      })

      $scope.err = null;

      $scope.login = function(callback) {
        $scope.err = null;
        loginService.login($scope.email, $scope.pass, '/', function(err, user) {
          $scope.err = err||null;
          typeof(callback) === 'function' && callback(err, user);
        });
      };

      $scope.createAccount = function() {
        if( !$scope.name ) {
            $scope.err = 'Please enter your name';
        }
        else if( !$scope.email ) {
          $scope.err = 'Please enter an email address';
        }
        else if( !$scope.pass ) {
          $scope.err = 'Please enter a password';
        }
        else if( !$scope.businessname ) {
            $scope.err = 'Please enter a business name';
        }
        else {
          loginService.createAccount($scope.name, $scope.email, $scope.pass, function(err, user) {
            if( err ) {
              $scope.err = err;
            }
            else {
              $scope.login(function(err) {
                if( !err ) {
                  loginService.createProfile(user.id, $scope.name, user.email, $scope.businessname);
                }
              });
            }
          });
        }
      };
    }]);