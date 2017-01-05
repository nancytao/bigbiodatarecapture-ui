(function() {
    'use strict'; //makes JS almost have rules

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;
        vm.user = null;
        vm.apikey = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function(user) {
                vm.user = user;

                // get user's api key
                UserService.GetApikey(vm.user._id).then(function(key) {
                    vm.apikey = key;
                });
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
