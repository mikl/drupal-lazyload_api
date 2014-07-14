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

  if (strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== 0 || $_SERVER['CONTENT_LENGTH'] < 2) {
    header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request', true, 400);
    return array(
      'http_error' => '400 Bad Request'
    );
  }

  $response = array();

  $payload = json_decode(file_get_contents('php://input'), TRUE);

  foreach ($payload as $key => $params) {
    $response[$key] = module_invoke($params['module'], 'lazyload_api_content', $params['content_id'], $params);
  }

  return $response;
}
