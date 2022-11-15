<?php


$params['p'] = '1';
post_async('http://localhost/vger-test/data.php', $params);
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Content-Disposition: attachment; filename=vger-data.json');
header('Access-Control-Allow-Origin: *');
readfile('vger-data.json');

/*
 * Executes a PHP page asynchronously so the current page does not have to wait for it to     finish running.
 *  
 */
function post_async($url, array $params)
{
    foreach ($params as $key => &$val) {
      if (is_array($val)) $val = implode(',', $val);
        $post_params[] = $key.'='.urlencode($val);  
    }
    $post_string = implode('&', $post_params);

    $parts=parse_url($url);

    $fp = fsockopen($parts['host'],
        isset($parts['port'])?$parts['port']:80,
        $errno, $errstr, 30);

    $out = "GET ".$parts['path']." HTTP/1.1\r\n";
    $out.= "Host: ".$parts['host']."\r\n";
    $out.= "Content-Type: application/x-www-form-urlencoded\r\n";
    $out.= "Content-Length: ".strlen($post_string)."\r\n";
    $out.= "Connection: Close\r\n\r\n";
    if (isset($post_string)) $out.= $post_string;

    fwrite($fp, $out);
    fclose($fp);
}
?>