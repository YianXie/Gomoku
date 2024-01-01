<?php 
session_start();
$gameId = $_SESSION["gameId"];

$jsonData = file_get_contents("php://input");
$gameInfo = json_decode($jsonData,true);

$fileName = "./multiplayer/" . $gameId . ".txt";
$file = fopen($fileName,"a") or die("unable to open file");
if ($file) {
    fwrite($file,$jsonData."\r\n");
    fclose($file);
}
?>