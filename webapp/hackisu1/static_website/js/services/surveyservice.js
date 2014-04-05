'use strict';

angular.module('surveyorApp.services.surveys', ['surveyorApp.services.firebaseRefs', 'surveyorApp.services.login'])
    .factory('Surveys', ['angularFireCollection', 'FireRef',
        function(angularFireCollection, FireRef) {
            return {
                surveyCollection: function(cb) {
                    return angularFireCollection(FireRef.surveys(),cb);
                }
                , findSurvey: function(userId) {
                    FireRef.active_surveys(userId).once('value', function(snapshot) {
                        var activesurvey = snapshot.val();
                        if(activesurvey!=null){
                            var arrayLength = activesurvey.length;
                            var ans;
                            for (var i = 0; i < arrayLength; i++) {
                                FireRef.surveys().child('/'+activesurvey[i]).once('value', function(snapshot1) {
                                    //console.log(snapshot1.val().questions[0].q_str);
                                    for(var j = 0; j < 3; j++)
                                        ans += snapshot1.val().questions[j].q_str+","+snapshot1.val().questions[j].answers[0]+','+snapshot1.val().questions[j].answers[1]+','+snapshot1.val().questions[j].answers[2];
                                });
                                //Do something
                            }
                            return ans;
                        }
                        else
                           return null;
                    });
                    //return FireRef.surveys().child('/'+userId);
                }
                , createSurvey: function(userId, q1, o1, q2, o2, q3, o3) {
                    return FireRef.surveys().push({company_id:userId, questions :[{q_id:0, q_str:q1, answers:o1.split(",")},{q_id:1, q_str:q2, answers:o2.split(",")},{q_id:2, q_str:q3, answers:o3.split(",")}]}).name();
                }
                , removeSurvey: function(userId) {
                    var survey = FireRef.surveys().child('/'+userId)
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