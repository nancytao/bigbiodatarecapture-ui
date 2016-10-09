(function() {
	'use strict';

	angular
		.module('app')
		.controller('Papers.IndexController', Controller);

	function Controller($window, BiodataService, FlashService) {
		var vm = this;
		vm.articleId = null;
		vm.getPaper = getPaper;
		vm.getPaperByTitle = getPaperByTitle;
		vm.clear = clear;
		vm.paper = null;

		function getPaper() {
			BiodataService.GetById(vm.articleId._id).then(function(biodata) {
				vm.articleId = biodata;
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.articleId = {'_id': vm.articleId._id};
				FlashService.Error(error);
			});
		}

		function getPaperByTitle() {
			BiodataService.GetByTitle(vm.articleId.title).then(function(biodata) {
				vm.articleId = biodata;
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.articleId = {'title': vm.articleId.title};
				FlashService.Error(error);
			});
		}

		function clear() {
			vm.articleId = null;
			FlashService.Success("Cleared Data");
		}
	}
})();