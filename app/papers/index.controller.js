(function() {
	'use strict';

	angular
		.module('app')
		.controller('Papers.IndexController', Controller);

	function Controller($window, BiodataService, FlashService) {
		var vm = this;
		vm.article = null;
		vm.getPaper = getPaper;
		vm.getPaperByTitle = getPaperByTitle;
		vm.clear = clear;
		vm.paper = null;

		function getPaper() {
			BiodataService.GetById(vm.article._id).then(function(biodata) {
				vm.article = biodata;
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.article = {'_id': vm.article._id};
				FlashService.Error(error);
			});
		}

		function getPaperByTitle() {
			BiodataService.GetByTitle(vm.article.title).then(function(biodata) {
				vm.article = biodata;
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.article = {'title': vm.article.title};
				FlashService.Error(error);
			});
		}

		function savePaper() {
			BiodataService.Update(vm.article)
			.then(function() {
				FlashService.Success("Article updated");
			})
			.catch(function(error) {
				FlashService.Error(error);
			});
		}

		function clear() {
			vm.article = null;
			FlashService.Success("Cleared Data");
		}
	}
})();