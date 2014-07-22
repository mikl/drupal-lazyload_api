/**
 * @file
 * Core JavaScript for the lazyload API module.
 */

(function($, undefined) {
  'use strict';

  // Define a hopefully unique concatenation string we can later split
  // on if necessary.
  var concatenator = '(=.=)';

  var lazyloadAll = function (context) {
    // The payload to send to the server to get our data back.
    var payload = {};

    // Collect all elements to lazy load.
    $('.lazyload-api-placeholder', context).each(function () {
      var elem = $(this);
      var moduleName = elem.data('module');
      var contentId = elem.data('content-id');
      var key = moduleName + concatenator + contentId;
      payload[key] = {
        module: moduleName,
        content_id: contentId
      };
    });

    var settings =  {
      url: '/lazyload_api/bulk',
      submit: {
        payload: payload
      }
    };

    // Post the data to the backend using drupals ajax framework.
    Drupal.ajax['lazyload_api'] = new Drupal.ajax('lazyload-api', context.body, settings);
    Drupal.ajax['lazyload_api'].eventResponse(Drupal.ajax['lazyload_api']);
  };

  // Define a Drupal behavior, so we can run lazyload on all content
  // added to a page via AJAX.
  // Will also run for the inital page load.
  Drupal.behaviors.lazyloadAPI = {
    attach: function (context, settings) {
      $(context.body).once('lazyloaded', function() {
        lazyloadAll(context);
      });
    }
  };

}(jQuery));
