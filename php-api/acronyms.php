<?php
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Content-Disposition: attachment; filename=acronyms.json');
    header('Access-Control-Allow-Origin: *');
    readfile('acronyms.json');

?>