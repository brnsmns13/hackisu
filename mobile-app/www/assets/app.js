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
    .when('/survey/:surveyID', {
        controller: 'SurveyCtrl',
        templateUrl: '/views/take_survey.html'
    })
    .when('/coupon', {
        controller: 'CouponCtrl',
        templateUrl: '/views/coupon.html'
    })
    .when('/coupon/:couponID', {
        controller: 'CouponCtrl',
        templateUrl: '/views/coupon.html'
    })
    .otherwise({
        redirectTo: '/login'
    })
})

.controller('MainCtrl', function($scope, Firebase, Users, Surveys) {
    $scope.u = Users;
    $scope.s = Surveys;
})

.controller('LoginCtrl', function($scope, $location, Firebase) {
    $scope.do_login = function() {
        var auth = new FirebaseSimpleLogin(Firebase, function(error, user) {
            if(user) {
                $location.path("/main");
            } else {
                $location.path("/login");
            }
        });
        auth.login('password', {
            email: $scope.email,
            password: $scope.password
        });
    }
})

.controller('SurveyCtrl', function($scope, $routeParams, $location, Surveys) {
    
    $scope.submit_survey = function() {
        $location.path("/coupon");
    }
    
    //var julieRef = new Firebase('https://SampleChat.firebaseIO-demo.com/users/julie/');
    
    $scope.surveys = Surveys;
    $scope.survey = $scope.surveys["-JJmDalXyYdfNE2UF0aW"];
})

.controller('CouponCtrl', function($scope, $routeParams, $location, Firebase) {
    $scope.goto_link = function(link) {
        $location.path(link.toString().trim());
    }
    if($routeParams.couponID != null) {
        $scope.selected = true;
        document.getElementById("back-link").href = "#/coupon"
        // Get from firebase
        $scope.coupon = {
            business_name: "Business 1",
            description: "Good for 5% off any order!"
        };
    } else {
        $scope.selected = false;
        // Get from firebase
        $scope.coupons = [
            {
                c_id: 1,
                business_name: "Lorry's Coffee",
                description: "25% of any regular drip coffee!"
            },
            {
                c_id: 2,
                business_name: "Pixels Video Games",
                description: "5% off any purchase!"
            }
        ];
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
            var dataRef = new Firebase(fbURL + '/surveys/' + s + '/description');
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