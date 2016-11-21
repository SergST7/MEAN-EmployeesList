var app = angular.module('timetrack', ['ui.router', 'mgcrea.ngStrap', 'angular-loading-bar','angularUtils.directives.dirPagination']);

app.config(['$stateProvider','$urlRouterProvider',
	function ($stateProvider,$urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "templates/home.html"
			})
			.state('NewEmployee', {
				url: "/addnew",
				templateUrl: "templates/newEmployee.html"
			})
			// .state('EditEmployee', {
			// 	url: "/editemployee",
			// 	templateUrl: "templates/editEmployee.html"
			// })
	}
]);

app.run(function($rootScope, $state) {
	$rootScope.$state = $state;
	$rootScope.uri = 'https://sleepy-wave-61782.herokuapp.com/';
	// $rootScope.$uri = 'http://localhost:8080';

});

app.service('sharedEmployee', function () {
	var property = [];
	return {
		getProperty: function () {
			return property;
		},
		setProperty: function(value) {
			property = value;
		}
	};
});

app.filter('searchFor', function(){
	return function(arr, searchPeople){
		if(!searchPeople){
			return arr;
		}
		var result = [];
		searchPeople = searchPeople.toLowerCase();
		angular.forEach(arr, function(item){
			if(item.lastName.toLowerCase().indexOf(searchPeople) !== -1 || item.firstName.toLowerCase().indexOf(searchPeople) !== -1){
			result.push(item);
		}
		});
		return result;
	};
});


app.controller('employees-list',function($scope,$state,$http,sharedEmployee,$filter){
	$scope.employeesList = {};
	$scope.pageSize = 5;
	$scope.currentPage = 1;
	$http.get("https://sleepy-wave-61782.herokuapp.com/employees").success(function(response){
		if(response.error === 0){
			console.log(response);
			$scope.employeesList = response.Employees;
			$scope.items2 = $scope.employeesList;
			$scope.$watch('searchPeople', function(val){
				$scope.employeesList = $filter('searchFor')($scope.items2, val);
			});
		}else{
			$scope.employeesList = [];
		}
	});
	
	$scope.editEmployee = function($index){
		$scope.number = ($scope.pageSize * ($scope.currentPage - 1)) + $index;
		sharedEmployee.setProperty($scope.employeesList[$scope.number]);
	};
	
	$scope.deleteEmployee = function($index){
		$scope.number = ($scope.pageSize * ($scope.currentPage - 1)) + $index;
		$http.delete($scope.uri +  "employees/"+$scope.employeesList[$scope.number]._id).success(function(res){
			if(res.error == 0){
				$state.go($state.current, {}, {reload: true});
			}else{
				
			}
		});
	};
});

app.controller('add-new-employee',function($scope,$http,$state){
	$scope.employee = {};
	$scope.addEmployee = function(){
		var payload = {
			"lastName":$scope.emloyee.lastName,
			"firstName":$scope.emloyee.firstName,
			"middleName":$scope.emloyee.middleName,
			"job":$scope.emloyee.job,
			"department":$scope.emloyee.department,
			"date":$scope.emloyee.date,
			"startTime":$scope.emloyee.startTime,
			"endTime":$scope.emloyee.endTime
		};
		$http.post("https://sleepy-wave-61782.herokuapp.com/employees",payload).success(function(res){
			if(res.error == 0){
				$state.go("home");
			}else{
				
			}
		});
	};
});

app.controller('edit-employee',function($scope,$http,$state,sharedEmployee){
	$scope.employeeData = sharedEmployee.getProperty();
	$scope.updateEmployee = function(){
		var payload = {
			"id":$scope.employeeData._id,
			"date":$scope.employeeData.date,
			"startTime":$scope.employeeData.startTime,
			"endTime":$scope.employeeData.endTime
		};
		$http.put("https://sleepy-wave-61782.herokuapp.com/employees",payload).success(function(res){
			if(res.error == 0){
				$state.go($state.current, {}, {reload: true});

			}else{
				
			}
		});
	};
	// $scope.cancel = function(){
	// 	$state.go($state.current, {}, {reload: true})
	// };
});