<?php
/**
 * @file
 * Page callbacks for the lazyload_api module.
 */

/**
 * Page callback to bulk-load lazyload content.
 */
function lazyload_api_pages_load_bulk() {
  if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 405 Method Not Allowed', true, 405);
    return array(
      'http_error' => '405 Method Not Allowed'
    );
  }

  $payload = $_POST['payload'];

  $commands = array();

  foreach ($payload as $key => $params) {
    $selector = '.' . lazyload_api_get_class_name($params['module'], $params['content_id']);
    $commands[] = module_invoke($params['module'], 'lazyload_api_content', $params['content_id'], $selector, $params);
  }

  return array('#type' => 'ajax', '#commands' => $commands);
}
