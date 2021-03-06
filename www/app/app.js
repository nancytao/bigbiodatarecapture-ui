(function() {
	'use strict';

	angular
		.module('app', ['ui.router'])
		.config(config)
		.run(run);

	function config($stateProvider, $urlRouterProvider, $compileProvider) {
		//default route
		$urlRouterProvider.otherwise("/");

		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:application\//);

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'home/index.html',
				controller: 'Home.IndexController',
				controllerAs: 'vm',
				data: { activeTab: 'home' }
			})
			.state('account', {
				url: '/account',
				templateUrl: 'account/index.html',
				controller: 'Account.IndexController',
				controllerAs: 'vm',
				data: { activeTab: 'account' }
			})
			.state('papers', {
				url: '/papers',
				templateUrl: 'papers/index.html',
				controller: 'Papers.IndexController',
				controllerAs: 'vm',
				data: {activeTab: 'papers'}
			})
			.state('edit', {
				url: '/papers/:_id',
				templateUrl: 'papers/edit.html',
				controller: 'Papers.IndexController',
				controllerAs: 'vm',
				data: {activeTab: 'papers'}
			});


	}

	function run($http, $rootScope, $window) {
		// add JWT token as default auth header
		$http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

		//update active tab on state change
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			$rootScope.activeTab = toState.data.activeTab;
		});
	}

	$(function () {
		// get JWT token from server
		$.get('/app/token', function(token) {
			window.jwtToken = token;
			angular.bootstrap(document, ['app']);
		});
	});
})();