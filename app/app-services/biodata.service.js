(function () {
	'use strict';

	angular
		.module('app')
		.factory('BiodataService', Service);

	function Service($http, $q) {
		var service = {};

		service.GetById = GetById;
		service.GetByTitle = GetByTitle;
		service.Update = Update;
		service.UploadPDF = UploadPDF;
		service.paper = null;
		service.SetPaper = SetPaper;
		service.GetPaper = GetPaper;

		return service;

		function GetById(_id) {
			return $http.get('/api/biodata/' + _id).then(handleSuccess, handleError);
		}

		function GetByTitle(title) {
			return $http.get('/api/biodata/title/' + title).then(handleSuccess, handleError);
		}

		function Update(paper) {
			return $http.put('/api/biodata/' + paper._id, paper).then(handleSuccess, handleError);
		}

		function UploadPDF(pdf, _id) {
			return $http.put('/api/biodata/pdf/' + _id, pdf).then(handleSuccess, handleError);
		}

		function SetPaper(_id) {
			service.paper = $http.get('/api/biodata/' + _id).then(handleSuccess, handleError);
			return service.paper;
		}

		function GetPaper() {
			return service.paper;
		}

		function handleSuccess(res) {
			return res.data;
		}

		function handleError(res) {
			return $q.reject(res.data);
		}
	}
})();