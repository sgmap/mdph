'use strict';

angular.module('impactApp')
  .controller('DemandeCtrl', function($scope, $state, mdph, user, request, RequestService) {
    $scope.request = request;
    $scope.mdph = mdph;
    $scope.formAnswers = request.formAnswers;
    $scope.getCompletion = RequestService.getCompletion;

    if (user && !request._id) {
      request.$save(function(result) {
        $state.go('departement.demande', {shortId: result.shortId});
      });
    }

    $scope.estAdulte = function() {
      return RequestService.estAdulte(request);
    };
  });
