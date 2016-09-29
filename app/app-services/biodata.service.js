(function () {
	'use strict';

	angular
		.module('app')
		.factory('BiodataService', Service);

	function Service($http, $q) {
		var service = {};

		service.GetById = GetById;

		return service;

		function GetById(_id) {
			console.log("Test3");
			return $http.get('/api/biodata/' + _id).then(handleSuccess, handleError);
		}
		//private functions

		function handleSuccess(res) {
			return res.data;
		}
		function handleError(res) {
			return $q.reject(res.data);
		}
	}
})();