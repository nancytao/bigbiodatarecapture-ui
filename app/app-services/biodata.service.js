(function () {
	'use strict';

	angular
		.module('app')
		.factory('BiodataService', Service);

	function Service($http, $q) {
		var service = {};

		service.GetById = GetById;
		service.GetByTitle = GetByTitle;

		return service;

		function GetById(_id) {
			return $http.get('/api/biodata/' + _id).then(handleSuccess, handleError);
		}

		function GetByTitle(title) {
			return $http.get('/api/biodata/title/' + title).then(handleSuccess, handleError);
		}

		function Update(article) {
			return $http.put('/api/biodata/' + article._id, article).then(handleSuccess, handleError);
		}

		function handleSuccess(res) {
			return res.data;
		}
		function handleError(res) {
			return $q.reject(res.data);
		}
	}
})();