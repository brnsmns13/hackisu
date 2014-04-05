'use strict';

angular.module('surveyorApp.services.firebaseRefs', [])
    .factory('FireRef', ['FBURL', 'Firebase',
        function(FBURL, Firebase) {
            return {
                surveys: function() {
                    return new Firebase(FBURL+'/surveys');
                }
                , users: function() {
                    return new Firebase(FBURL+'/users');
                } , active_surveys: function(userId) {
                    return new Firebase(FBURL+'/users/'+userId+'/business_data/active_surveys');
                }

            }
        }])