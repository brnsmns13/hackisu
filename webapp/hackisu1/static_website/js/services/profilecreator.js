'use strict';

angular.module('surveyorApp.services.profileCreator', [])
  .factory('profileCreator', ['Firebase', 'FBURL', '$rootScope', function(Firebase, FBURL, $rootScope) {
    return function(id, name, email, businessname, callback) {
      new Firebase(FBURL).child('users/'+id).set({email: email, name: name, businessname: businessname}, function(err) {
        if( callback ) {
          callback(err);
          $rootScope.$apply();
        }
      });
    }
  }]);