var app = angular.module('drf-angular', [
	'ui.router'
]);

app.constant('BASE_URL', 'http://localhost:8000/api/');

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/static/templates/home.html',
			controller: 'MainCtrl'
		})
		.state('add-todo', {
			url: "/add",
			templateUrl: 'static/templates/add_todo.html',
			controller: 'MainCtrl'
		})
		.state('login', {
			url:'/',
			templateUrl:'static/templates/login.html',
			controller: 'LoginCtrl'
		})
		.state('register', {
            url: '/register',
            templateUrl: 'static/templates/register.html',
			controller: 'LoginCtrl'

	});

	$urlRouterProvider.otherwise('/');
});

app.controller('MainCtrl', function($scope, Todos, $state, $filter, $http){
	$scope.todos = [];
	$scope.newTodo = {};

	$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')($scope.todos, { is_completed: false }).length;
	}, true);

	$scope.addTodo = function() {
		Todos.addOne($scope.newTodo)
			.then(function(res){
				// redirect to homepage once added
				$state.go('home');
			});
	};

	$scope.toggleCompleted = function(todo) {
		Todos.update(todo);
	};

	$scope.deleteTodo = function(id){
		Todos.delete(id);
		// update the list in ui
		$scope.todos = $scope.todos.filter(function(todo){
			return todo.id !== id;
		})
	};

	// var token = localStorage.getItem('token');
	// if (token) {
	// 	$http.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('token');
	// 	$state.go('home');
	// }
	Todos.all().then(function(res){
		$scope.todos = res.data;
	});
});

app.controller('LoginCtrl', function ($scope, Authorization, $state, $http) {
	$scope.loginForm = {};
	$scope.login = function () {
		Authorization.login($scope.loginForm)
			.then(function (res) {
				localStorage.setItem('token', res.data.token);
				$http.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('token');
				$state.go('home');
            });
    };
	$scope.logout = function () {
		$scope.loginForm = {};
		localStorage.removeItem('token');
		$state.go('login');
    };
	$scope.registerOpen = function () {
		$state.go('register');
    };




	var token = localStorage.getItem('token');
	if (token) {
		$state.go('home');
	}
});

app.service('Authorization', function ($http, BASE_URL) {
	var Authorization = {};

	Authorization.login = function (loginForm) {
		return $http.post('api-token-auth/', loginForm);
    };
	return Authorization;
});

app.service('Todos', function($http, BASE_URL){
	var Todos = {};
	var todos_url = BASE_URL + 'todos/';

	Todos.all = function(){
		$http.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('token');
		return $http.get(todos_url);
	};

	Todos.update = function(updatedTodo){
		$http.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('token');
		return $http.put(todos_url + updatedTodo.id + '/', updatedTodo);
	};

	Todos.delete = function(id){
		$http.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('token');
		return $http.delete(todos_url + id + '/');
	};

	Todos.addOne = function(newTodo){
		$http.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('token');
        return $http.post(todos_url, newTodo)
    };

	return Todos;
});
