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

    // Reference to all the elements, so we can put the content in the
    // right place once the rendered output comes back from the server.
    var placeholders = {};

    $('.lazyload-api-placeholder', context).each(function () {
      var elem = $(this);
      var moduleName = elem.data('module');
      var contentId = elem.data('content-id');
      var key = moduleName + concatenator + contentId;

      payload[key] = {
        module: moduleName,
        content_id: contentId
      };

      placeholders[key] = elem;
    });

    if (payload) {
      $.ajax({
        url: Drupal.settings.basePath + 'lazyload_api/bulk',
        type: 'POST',
        contentType: 'application/json',

        data: JSON.stringify(payload),
        dataType: 'json',
        processData: false,

        error: function (jqXHR, textStatus, errorThrown) {
          // TODO: Handle errors.
        },
        success: function (data) {
          $.each(data, function (key, value) {
            // Replace the placeholder with the loaded elements.
            if (placeholders[key]) {
              placeholders[key].replaceWith($(value));
            }
          });
        }
      });
    }
  };

  // Define a Drupal behavior, so we can run lazyload on all content
  // added to a page via AJAX.
  // Will also run for the inital page load.
  Drupal.behaviors.lazyloadAPI = {
    attach: function (context, settings) {
      lazyloadAll(context);
    }
  };

}(jQuery));
