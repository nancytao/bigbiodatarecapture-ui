(function() {
	'use strict';

	angular
		.module('app')
		.controller('Papers.IndexController', Controller);

	function Controller($window, BiodataService, FlashService) {
		var vm = this;

		// methods
		vm.getPaper = getPaper;
		vm.getPaperByTitle = getPaperByTitle;
		vm.savePaper = savePaper;
		vm.uploadPDF = uploadPDF;
		vm.setPaper = setPaper;
		vm.loadPaperForEdit = loadPaperForEdit;
		vm.clear = clear;
		vm.convert64 = convert64;

		// variables
		vm.search = null;
		vm.paper = loadPaperForEdit();
		vm.paperList = [];
		vm.sortType = 'id';

		function getPaper() {
			BiodataService.GetById(vm.search._id).then(function(biodata) {
				vm.paperList = [biodata];
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.paperList = [{'_id': vm.search._id}];
				FlashService.Error(error);
			});
		}

		function getPaperByTitle() {
			BiodataService.GetByTitle(vm.search.title)
			.then(function(biodata) {
				vm.paperList = biodata.sort(function (a, b) {
				    if (a._id > b._id) {
				    	return 1;
				  	} else if (a._id < b._id) {
				    	return -1;
				  	} else {
				  		return 0;
				  	}
				}); // sorting is required to make vm.sortType work properly with _id
				FlashService.Success("Match Found!");
			})
			.catch(function(error) {
				vm.search = {'title': vm.search.title};
				FlashService.Error(error);
			});
		}

		function setPaper(_id) {
			BiodataService.SetPaper(_id)
			.then(function(paper) {
				// nothing
			})
			.catch(function(error) {
				FlashService.Error(error);
			});
		}

		function loadPaperForEdit() {
			BiodataService.GetPaper()
			.then(function(paper) {
				vm.paper = paper;
				return vm.paper;
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
			BiodataService.UploadPDF(vm.paper)
			.then(function() {
				FlashService.Success("PDF uploaded");
				})
			.catch(function(error) {
				FlashService.Error(error);
			});
			window.open(vm.paper.pdf);
		}
		function convert64() {
			var file = document.getElementById('file').files[0];
			var fileReader = new FileReader();
			fileReader.addEventListener("load", function() {
				vm.paper.pdf = fileReader.result;
				uploadPDF();
			});
			if (file) {
				fileReader.readAsDataURL(file);
			}
		}

		function clear() {
			vm.search = null;
			vm.paperList = [];
			FlashService.Success("Cleared Search/Data");
		}
	}
})();