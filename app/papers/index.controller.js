(function() {
	'use strict';

	angular
		.module('app')
		.controller('Papers.IndexController', Controller);

	function Controller($window, BiodataService, FlashService) {
		var pdf = null;
		var vm = this;
		vm.paper = null;
		vm.getPaper = getPaper;
		vm.getPaperByTitle = getPaperByTitle;
		vm.savePaper = savePaper;
		vm.clear = clear;
		vm.paper = null;

		function getPaper() {
			BiodataService.GetById(vm.paper._id).then(function(biodata) {
				vm.paper = biodata;
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.paper = {'_id': vm.paper._id};
				FlashService.Error(error);
			});
		}

		function getPaperByTitle() {
			BiodataService.GetByTitle(vm.paper.title).then(function(biodata) {
				vm.paper = biodata;
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.paper = {'title': vm.paper.title};
				FlashService.Error(error);
			});
		}

		function savePaper() {
			BiodataService.Update(vm.paper)
			.then(function() {
				FlashService.Success("Paper info updated");
			})
			.catch(function(error) {
				FlashService.Error(error);
			});
		}

		function uploadPDF() {
			BiodataService.UploadPDF(vm.pdf, vm.paper._id)
			.then(function() {
				FlashService.Success("PDF Uploaded");
			})
			.catch(function(error) {
				FlashService.Error(error);
			});
		}

		function add() {
			var f = document.getElementById('file').files[0], r = new FileReader();
			r.onloadend = function(e){
				pdf = e.target.result;
			}
		}

		function clear() {
			vm.paper = null;
			FlashService.Success("Cleared Search/Data");
		}
	}
})();