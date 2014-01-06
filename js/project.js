angular.module('scheduleAssignments', ['ngRoute', 'firebase'])

.value('firebaseUrl', 'https://babysitting-ring-manager.firebaseio.com/')

.factory('BabysittingData', function(angularFireCollection, firebaseUrl) {
    return angularFireCollection(new Firebase(firebaseUrl));
})

.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller:'ListCtrl',
        templateUrl:'list.html'
    })
    .when('/edit-assignment/:scheduleAssignmentId', {
        controller:'EditAssignmentCtrl',
        templateUrl:'assignmentDetail.html'
    })
    .when('/edit-family/:familyId', {
        controller:'EditFamilyCtrl',
        templateUrl:'familyDetail.html'
    })
    .when('/new-assignment', {
        controller:'CreateAssignmentCtrl',
        templateUrl:'assignmentDetail.html'
    })
    .when('/new-family', {
        controller:'CreateFamilyCtrl',
        templateUrl:'familyDetail.html'
    })
    .otherwise({
        redirectTo:'/'
    });
})

.controller('ListCtrl', function($scope, BabysittingData) {
    $scope.babysittingData = BabysittingData;
})

.controller('CreateAssignmentCtrl', function($scope, $location, $timeout, BabysittingData) {
    $scope.babysittingData = BabysittingData;
    $scope.save = function() {
        $scope.scheduleAssignment.familyId = $scope.scheduleAssignment.family.$id;
        console.log($scope.scheduleAssignment.family.$id);
        BabysittingData.add($scope.scheduleAssignment, function() {
            $timeout(function() { $location.path('/'); });
        });
    };
})

.controller('CreateFamilyCtrl', function($scope, $location, $timeout, BabysittingData) {
    $scope.save = function() {
        BabysittingData.add($scope.family, function() {
            $timeout(function() { $location.path('/'); });
        });
    };
})

.controller('EditAssignmentCtrl',
function($scope, $location, $routeParams, angularFire, firebaseUrl) {

    var scheduleAssignmentUrl = firebaseUrl + $routeParams.scheduleAssignmentId;
    var bindToScheduleAssignment = angularFire(new Firebase(scheduleAssignmentUrl), $scope, 'remote', {});

    bindToScheduleAssignment.then(function() {

        $scope.scheduleAssignment = angular.copy($scope.remote);
        $scope.scheduleAssignment.$id = $routeParams.scheduleAssignmentId;

        $scope.isClean = function() {
            return angular.equals($scope.remote, $scope.scheduleAssignment);
        }

        $scope.destroy = function() {
            $scope.remote = null;
            $location.path('/');
        };

        $scope.save = function() {
            $scope.remote = angular.copy($scope.scheduleAssignment);
            $location.path('/');
        };
    });
})

.controller('EditFamilyCtrl',
function($scope, $location, $routeParams, angularFire, firebaseUrl) {

    var familyUrl = firebaseUrl + $routeParams.familyId;
    var bindToFamily = angularFire(new Firebase(familyUrl), $scope, 'remote', {});

    bindToFamily.then(function() {

        $scope.family = angular.copy($scope.remote);
        $scope.family.$id = $routeParams.familyId;

        $scope.isClean = function() {
            return angular.equals($scope.remote, $scope.family);
        }

        $scope.destroy = function() {
            $scope.remote = null;
            $location.path('/');
        };

        $scope.save = function() {
            $scope.remote = angular.copy($scope.family);
            $location.path('/');
        };
    });
});
