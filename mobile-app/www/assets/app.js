window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

angular.module('hackisu', ['ngRoute', 'firebase'])
.value('fbURL', 'https://hackisu.firebaseio.com/')

.factory('Firebase', function($firebase, fbURL) {
    return $firebase(new Firebase(fbURL));
})
.factory('Surveys', function($firebase, fbURL) {
    return $firebase(new Firebase(fbURL + 'surveys'));
})
.factory('Users', function($firebase, fbURL) {
    return $firebase(new Firebase(fbURL + 'users'));
})

.config(function($routeProvider) {
    $routeProvider
    .when('/main', {
        controller: 'MainCtrl',
        templateUrl: '/views/main.html'
    })
    .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: '/views/login.html'
    })
    .when('/favs', {
        controller: 'FavoritesCtrl',
        templateUrl: '/views/favorites.html'
    })
    .when('/favs/:favID', {
        controller: 'FavoriteCtrl',
        templateUrl: '/views/favorites.html'
    })
    .when('/find_local', {
        controller: 'FindLocalCtrl',
        templateUrl: '/views/find_local.html'
    })
    .when('/find_local/:busID', {
        controller: 'FindLocalCtrl',
        templateUrl: '/views/find_local.html'
    })
    .when('/business/:busID', {
        controller: 'BusinessCtrl',
        templateUrl: '/views/business.html'
    })
    .when('/coupon', {
        controller: 'CouponCtrl',
        templateUrl: '/views/coupon.html'
    })
    .when('/coupon/:code', {
        controller: 'CouponCtrl',
        templateUrl: '/views/coupon.html'
    })
    .when('/surveys', {
        controller: 'SurveyListCtrl',
        templateUrl: '/views/surveys.html'
    })
    .when('/surveys/:id', {
        controller: 'SurveyCtrl',
        templateUrl: '/views/take_survey.html'
    })
    .otherwise({
        redirectTo: '/main'
    })
})

.controller('MainCtrl', function($scope, $rootScope, $location, Users, Surveys) {
    $scope.gotoview = function(view) {
        if(view == 'business') {
            $location.path('/surveys');
        }
        $location.path('/surveys');
    };
})

.controller('LoginCtrl', function($scope, $location, $rootScope, Firebase) {
    $scope.debug = "test";
    $scope.do_login = function() {
        $scope.email = "test@test.com";
        $scope.password = "test";
        var ref = new Firebase(fbURL);
        var auth = new FirebaseSimpleLogin(ref, function(error, user) {
            if (error) {
                // an error occurred while attempting login
                //console.log(error);
            } else if (user) {
                // user authenticated with Firebase
                //console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
            } else {
                // user is logged out
            }
        });
        auth.login('password', {
            email: "test@test.com",
            password: "test"
        });
        $scope.password = "test123";
        //$location.path("/favs");
    }
})

.controller('SurveyListCtrl', function($scope, $location, $http) {
    $http({
        url: 'http://slingshotapp.herokuapp.com/api/1/get/surveys/',
        method: "POST"
    }).success(function (data, status, headers, config) {
        $scope.surveys = data;
    }).error(function (data, status, headers, config) {
        $scope.surveys = [{
            name: "Error"
        }];
    });
    
    $scope.goto_link = function(link) {
        $location.path(link.toString().trim());
    }
})


.controller('SurveyCtrl', function($scope, $routeParams, $location, $http) {
    
    $scope.submit_survey = function(id) {
        $location.path('/surveys');
    }
    $scope.answering = true;
    // Transition to the next question
    $scope.next_question = function() {
        $scope.question_index++;
        if($scope.question_index == $scope.survey['questions'].length) {
            //$location.path('/surveys');
            $scope.answering = false;
        } else {
            $scope.current_question = $scope.survey['questions'][$scope.question_index];
        }
    }
    
    $http({
        url: 'http://slingshotapp.herokuapp.com/api/1/get/surveys/',
        method: "POST"
    }).success(function (data, status, headers, config) {
        for(var i = 0; i < data.length; i++) {
            if(data[i]['_id'] == $routeParams.id) {
                $scope.survey = data[i];
                $scope.current_question = "Success";
                $scope.current_question = $scope.survey['questions'][0];
                break;
            }
        }
    }).error(function (data, status, headers, config) {
        $scope.surveys = [{
            name: "Error"
        }];
        $scope.current_question = "error";
    });
    
    $scope.select = function(answer) {
        $scope.selected = answer;
    };
        
    $scope.itemClass = function(answer) {
        return answer === $scope.selected ? 'answer-selected' : undefined;
    };
    
    $scope.question_index = 0;
    $scope.current_question = "asdf";
    $scope.selected = undefined;
})

.controller('CouponCtrl', function($scope, $routeParams, $location, Firebase) {
    $scope.goto_link = function(link) {
        $location.path(link.toString().trim());
    }
    if($routeParams.code != null) {
        $scope.selected = true;
        document.getElementById("back-link").href = "#/coupon"
        // Get from firebase
        $scope.coupons = Firebase['rewards'];
        $scope.coupon = null;
        for(key in $scope.coupons) {
            if($scope.coupons[key].code == $routeParams.code) {
                $scope.coupon = $scope.coupons[key];
                break;
            }
        }
    } else {
        $scope.selected = false;
        // Get from firebase
        $scope.coupons = Firebase['rewards'];
    }
})

.controller('FavoritesCtrl', function($scope, $routeParams, Firebase) {
    
    // Get this with firebase...
    $scope.user_favorites = [
        {
            "business_id": 1,
            "surveys": [1,3,5],
            "name": "Lorry's Coffee",
            "description": "Lorry's coffee is a locally owned and operated coffee shop in the heart of Ames, Iowa. Located just across from Iowa State University"
        },
        {
            "business_id": 2,
            "surveys": [2,4,6],
            "name": "Pixels Video Games",
            "description": "We are an independent video game store located in Ames, IA that specializes in anything and everything video game related. From Atari 2600 to PS4 and Xbox One, we buy, sell, and trade it all."
        },
        {
            "business_id": 3,
            "surveys": [7,8,9],
            "name": "Jeff's Pizza Shop",
            "description": "My biggest motivator in the pizza business is the excitement generated by our customers. For me there is no better feeling in the world than seeing a satisfied smile on someone's face."
        }
    ];
    
    $scope.selected = false;
    if($routeParams.favID != null) {
        $scope.selected = true;
        $scope.favID = $routeParams.favID;
        $scope.fav = $scope.user_favorites[$scope.favID - 1];
        
        // Get survey by survey ids in business json
    }
    
})

.controller('BusinessCtrl', function($scope, $routeParams, $location, Users, Surveys) {
    $scope.goto_link = function(link) {
        $location.path(link.toString().trim());
    }
    
    $scope.business_id = $routeParams.busID;
    $scope.business = Users[$scope.business_id];
    $scope.business.surveys = [1,2,3];
})

.controller('FindLocalCtrl', function($scope, $routeParams, $location, Users, Surveys) {
    $scope.goto_link = function(link) {
        $location.path(link.toString().trim());
    }
    $scope.users = Users;
    $scope.businesses = [];
    
    for(key in $scope.users) {
        if($scope.users[key].is_business) {
            var temp = $scope.users[key];
            temp.id = key;
            $scope.businesses.push(temp);
        }
    }
    
    $scope.surveys = $scope.businesses[$routeParams.busID];
        for(s in $scope.surveys) {
            var dataRef = new Firebase(fbURL + 'surveys/' + s + '/description');
            s.description = dataRef;
        }

    // Get this with firebase...
    $scope.local = [
        {
            business_id: 1,
            surveys: [1,3,5],
            name: $scope.users,
            description: $scope.businesses
        }
    ];  
});