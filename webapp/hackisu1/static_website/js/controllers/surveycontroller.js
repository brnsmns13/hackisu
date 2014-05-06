'use strict';

angular.module('surveyorApp.controllers.surveys', ['surveyorApp.services.surveys'])
    .controller('SurveysController', ['$scope','$routeParams', '$location', 'angularFire', 'Surveys',
        function($scope, $routeParams, $location, angularFire, Surveys) {

            $scope.surveys = Surveys.surveyCollection();
            $scope.searchText = $scope.auth.id;
            $scope.userId = $routeParams.userId;

            $scope.createSurvey = function() {
                if( !$scope.question1 ) {
                    $scope.err = 'Please enter question1';
                }
                else if( !$scope.options1 ) {
                    $scope.err = 'Please enter options1';
                }
                else if( !$scope.question2 ) {
                    $scope.err = 'Please enter question2';
                }
                else if( !$scope.options2 ) {
                    $scope.err = 'Please enter options2';
                }
                else if( !$scope.question3 ) {
                    $scope.err = 'Please enter question3';
                }
                else if( !$scope.options3 ) {
                    $scope.err = 'Please enter options3';
                }
                else {
                    $scope.err ='Added to backend';
                    var surveyId = Surveys.createSurvey($scope.auth.id, $scope.question1, $scope.options1, $scope.question2, $scope.options2,$scope.question3, $scope.options3,function(err) {
                        if (!err) {
                            $scope.survey = null;
                            $location.path('/surveys/'+$scope.auth.id+'/'+surveyId);
                            $scope.$apply();
                        }
                    });
                    Surveys.updateSurvey($scope.auth.id, surveyId, null);
                }
            }

            $scope.removeSurvey = function(userId) {
                Surveys.removeSurvey(userId);
            }
        }])