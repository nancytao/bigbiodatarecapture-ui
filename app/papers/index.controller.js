(function() {
	'use strict';

	angular
		.module('app')
		.controller('Papers.IndexController', Controller);

	function Controller($window, BiodataService, FlashService) {
		var vm = this;
		vm.articleId = null;
		vm.getPaper = getPaper;

		function getPaper() {
			BiodataService.GetById(vm.articleId._id).then(function(biodata) {
				vm.articleId = biodata;
				console.log(vm.articleId);
			})
			.catch(function(error) {
				FlashService.Error(error);
			});
		}
	}
})();