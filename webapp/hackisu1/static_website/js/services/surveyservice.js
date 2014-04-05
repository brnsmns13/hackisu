'use strict';

angular.module('surveyorApp.services.surveys', ['surveyorApp.services.firebaseRefs', 'surveyorApp.services.login'])
    .factory('Surveys', ['angularFireCollection', 'FireRef',
        function(angularFireCollection, FireRef) {
            return {
                surveyCollection: function() {
                    return angularFireCollection(FireRef.surveys());
                }
                , createSurvey: function(userId, q1, o1, q2, o2, q3, o3) {
                    return FireRef.surveys().push({company_id:userId, questions :[{q_id:0, q_str:q1, answers:o1.split(",")},{q_id:1, q_str:q2, answers:o2.split(",")},{q_id:2, q_str:q3, answers:o3.split(",")}]}).name();
                }
                , removeSurvey: function(userId) {
                    var survey = FireRef.surveys();

                    survey.remove();
                },
                updateSurvey: function(userId, active_surveys, expired_surveys) {
                    FireRef.active_surveys(userId).once('value', function(snapshot) {
                        var newactivesurvey = snapshot.val();
                        if(newactivesurvey==null)
                            return FireRef.users().child(userId+'/business_data/').set({active_surveys:[active_surveys],expired_surveys:[expired_surveys],business_id:userId});
                        else{
                            newactivesurvey.push(active_surveys);
                            return FireRef.users().child(userId+'/business_data/').set({active_surveys:newactivesurvey,expired_surveys:[expired_surveys],business_id:userId});
                        }
                    });
                }
            }
        }])