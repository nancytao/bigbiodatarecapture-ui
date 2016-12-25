(function() {
    'use strict'; //makes JS almost have rules

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;
        vm.user = null;
        vm.getApikey = getApikey;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            //get current user
            UserService.GetCurrent().then(function(user) {
                vm.user = user;
            });
        }

        function getApikey() {
            UserService.GetApikey(vm.user._id)
                .then(function(key) {
                    FlashService.Success(key);
                })
                .catch(function(error) {
                    FlashService.Error(error);
                });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function() {
                    FlashService.Success('User updated');
                })
                .catch(function(error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function() {
                    //log user out
                    $window.location = '/login';
                })
                .catch(function(error) {
                    FlashService.Error(error);
                });
        }
    }
})();
