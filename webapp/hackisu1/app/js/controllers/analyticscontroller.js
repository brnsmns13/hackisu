'use strict';

angular.module('surveyorApp.controllers.analytics', [])
	.controller('AnalyticsCtrl', ['$scope', '$location', 'angularFire', 'FBURL', 
		function($scope, $location, angularFire, FBURL) {
		  	$scope.chart='bar';

		}])