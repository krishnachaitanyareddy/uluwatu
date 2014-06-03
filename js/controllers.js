'use strict';

/* Controllers */

var cloudbreakControllers = angular.module('cloudbreakControllers', []);

cloudbreakControllers.controller('cloudbreakController', ['$scope', '$http', 'Templates', '$location', '$rootScope',
    function ($scope, $http, Templates, $location, $rootScope) {
        $scope.form = undefined;
        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common['X-Requested-With'];
        $http.defaults.headers.common['Content-Type']= 'application/json';

        if($rootScope.apiUrl === null || $rootScope.apiUrl === undefined ) {
            $rootScope.apiUrl = "http://localhost:8080";
        }
        if($rootScope.basic_auth === null || $rootScope.basic_auth === undefined ) {
            $rootScope.basic_auth = "dXNlckBzZXEuY29tOnRlc3QxMjM=";
        }
        if($scope.credentials === null || $scope.credentials === undefined ) {
            $scope.credentials = [];
        }
        if($scope.templates === null || $scope.templates === undefined ) {
            $scope.templates = [];
        }
        if($scope.blueprints === null || $scope.blueprints === undefined ) {
            $scope.blueprints = [];
        }

        $scope.reloadCtrl = function(){
            console.log('reloading...');
            $route.reload();
        }

        $scope.signIn = function() {
            if(emailFieldLogin.value === "user@seq.com" && passwFieldLogin.value === "test123") {
                localStorage.signedIn = true;
                $rootScope.signedIn = true;
                $rootScope.activeUser = emailFieldLogin.value;
                $scope.doQuerys();
            }
        }

        $scope.signOut = function() {
            $rootScope.signedIn = false;
            localStorage.signedIn = false;
        }

        $scope.getCredentials = function() {
            $http({
                method: 'GET',
                dataType: 'json',
                withCredentials: true,
                url:  $rootScope.apiUrl + "/credential",
                headers: {
                    'Authorization': 'Basic ' + $rootScope.basic_auth,
                    'Content-Type': 'application/json'
                }
            }).success(function (data, status, headers, config) {
                $scope.credentials = data;
            }).error(function (data, status, headers, config) {
                console.log("unsuccess");
            });
        }

        $scope.getTemplates = function() {
            $http({
                method: 'GET',
                dataType: 'json',
                withCredentials: true,
                url:  $rootScope.apiUrl + "/template",
                headers: {
                    'Authorization': 'Basic ' + $rootScope.basic_auth,
                    'Content-Type': 'application/json'
                }
            }).success(function (data, status, headers, config) {
                $scope.templates = data;
            }).error(function (data, status, headers, config) {
                console.log("unsuccess");
            });
        }

        $scope.getBluePrints = function() {
            $http({
                method: 'GET',
                dataType: 'json',
                withCredentials: true,
                url:  $rootScope.apiUrl + "/blueprint",
                headers: {
                    'Authorization': 'Basic ' + $rootScope.basic_auth,
                    'Content-Type': 'application/json'
                }
            }).success(function (data, status, headers, config) {
                $scope.blueprints = data;
            }).error(function (data, status, headers, config) {
                console.log("unsuccess");
            });
        }


        $scope.createAwsTemplateRequest = function() {
            $scope.azureTemplate = false;
            $scope.awsTemplate = true;
        }

        $scope.createAzureTemplateRequest = function() {
            $scope.azureTemplate = true;
            $scope.awsTemplate = false;
        }

        $scope.createAwsCredentialRequest = function() {
            $scope.azureCredential = false;
            $scope.awsCredential = true;
        }

        $scope.createAzureCredentialRequest = function() {
            $scope.azureCredential = true;
            $scope.awsCredential = false;
        }

        $scope.createAwsTemplate = function() {
            console.log("aws cluster creation started...");
            $http({
                method: 'POST',
                dataType: 'json',
                withCredentials: true,
                url:  $rootScope.apiUrl + "/template",
                headers: {
                    'Authorization': 'Basic ' + $rootScope.basic_auth
                },
                data: {
                    cloudPlatform: "AWS",
                    clusterName: clname.value,
                    parameters: {
                        region: cllocation.value,
                        keyName:  keyname.value
                    }
                }
            }).success(function (data, status, headers, config) {
                $location.path("/");
            }).error(function (data, status, headers, config) {
                console.log("unsuccess");
                $scope.isFailedCreation = true;
            });
        }

        $scope.createAzureTemplate = function() {
            $scope.isSuccessCreation = true;
            $scope.isFailedCreation = false;
            $http({
                method: 'POST',
                dataType: 'json',
                withCredentials: true,
                url:  $rootScope.apiUrl + "/template",
                headers: {
                    'Authorization': 'Basic ' + $rootScope.basic_auth
                },
                data: {
                    cloudPlatform: "AZURE",
                    clusterName: clname.value,
                    parameters: {
                        location: cllocation.value,
                        name: clname.value,
                        description: description.value,
                        addressPrefix: subnetAddressPrefix.value,
                        deploymentSlot: deploymentSlot.value,
                        disableSshPasswordAuthentication: disableSshPasswordAuthentication.value,
                        vmType: vmType.value,
                        imageName: imageName.value,
                        userName: userName.value,
                        password: clpassword.value,
                        sshString: sshString.value
                    }
                }
            }).success(function (data, status, headers, config) {
                $location.path("/");
            }).error(function (data, status, headers, config) {
                console.log("unsuccess");
                $scope.isFailedCreation = true;
            });
        }

        $scope.createAwsCredential = function() {
            console.log("create aws");
            $http({
                method: 'POST',
                dataType: 'json',
                withCredentials: true,
                url:  $rootScope.apiUrl + "/credential",
                headers: {
                    'Authorization': 'Basic ' + $rootScope.basic_auth
                },
                data: {
                    cloudPlatform: "AWS",
                    parameters: {
                        roleArn: roleArn.value,
                        instanceProfileRoleArn: instanceProfileRoleArn.value
                    }
                }
            }).success(function (data, status, headers, config) {
                $location.path("/");
            }).error(function (data, status, headers, config) {
                console.log("unsuccess");
                $scope.isFailedCreation = true;
            });
        }

        $scope.createAzureCredential = function() {
            $http({
                method: 'POST',
                dataType: 'json',
                withCredentials: true,
                url:  $rootScope.apiUrl + "/credential",
                headers: {
                    'Authorization': 'Basic ' + $rootScope.basic_auth,
                },
                data: {
                    cloudPlatform: "AZURE",
                    parameters: {
                        subscriptionId: subscriptionId.value,
                        jksPassword: jksPassword.value
                    }
                }
            }).success(function (data, status, headers, config) {
                $location.path("/");
            }).error(function (data, status, headers, config) {
                console.log("unsuccess");
                $scope.isFailedCreation = true;
            });
        }

        $scope.doQuerys = function() {
            $scope.getCredentials();
            $scope.getTemplates();
            $scope.getBluePrints();
        }



        if (typeof (Storage) !== "undefined") {
            if (localStorage.signedIn === 'true') {
                $rootScope.signedIn = true;
                $rootScope.activeUser = "user@seq.com";
                $scope.doQuerys();
            }
        } else {
            console.log("No localstorage support!");
        }


    }
]);