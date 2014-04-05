'use strict';

angular.module('surveyorApp.services.profileCreator', [])
  .factory('profileCreator', ['Firebase', 'FBURL', '$rootScope', function(Firebase, FBURL, $rootScope) {
    return function(id, name, email, description, callback) {
      new Firebase(FBURL).child('users/'+id).set({email: email, name: name, description: description, is_business:true, business_data:{active_surveys:{},expired_surveys:{},business_id:id}}, function(err) {
        if( callback ) {
          callback(err);
          $rootScope.$apply();
        }
      });
    }
  }]);