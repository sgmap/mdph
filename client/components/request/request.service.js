'use strict';

angular.module('impactApp')
  .factory('RequestService', function RequestService() {
    function checkSections(request, sectionsObligatoires, cb) {
      var incompleteSections = [];
      sectionsObligatoires.forEach(function(section) {
        if (!request.formAnswers[section.id] || !request.formAnswers[section.id].__completion) {
          incompleteSections.push(section);
        }
      });

      if (incompleteSections.length > 0) {
        var errorStr = 'Veuillez renseigner les sections:\n';
        incompleteSections.forEach(function(section) {
          errorStr += '\t -' + section.label + '\n';
        });

        return cb(errorStr);
      }

      return cb();
    }

    function checkDocuments(request, documentsObligatoires, cb) {
      var incompleteDocuments = [];

      if (!request.documents || request.documents.length === 0) {
        incompleteDocuments = documentsObligatoires;
      } else {
        documentsObligatoires.forEach(function(documentObligatoire) {
          if (!_.find(request.documents, {type: documentObligatoire.id})) {
            incompleteDocuments.push(documentObligatoire);
          }
        });
      }

      if (incompleteDocuments.length > 0) {
        var errorStr = 'Vous devez fournir les documents obligatoires suivants:\n';
        incompleteDocuments.forEach(function(document) {
          errorStr += '\t -' + document.label + '\n';
        });

        return cb(errorStr);
      }

      return cb();
    }

    return {
      updatedAt: function(request) {
        return moment(request.updatedAt).fromNow();
      },

      isReadyToSend: function(request, sectionsObligatoires, documentsObligatoires, cb) {
        var errorStr = 'Votre demande ne peut être envoyée car elle n\'est pas complète.\n';
        var isValid = true;

        function check(err) {
          if (err) {
            errorStr += err;
            isValid = false;
          }
        }

        checkSections(request, sectionsObligatoires, check);
        checkDocuments(request, documentsObligatoires, check);

        if (isValid) {
          return cb();
        } else {
          return cb(errorStr);
        }
      }
    };
  });
