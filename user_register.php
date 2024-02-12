<?php 
session_start();

$username = htmlspecialchars($_POST["username"]);
$username = strtolower($username);
$password = htmlspecialchars($_POST["password"]);
$gameId = htmlspecialchars($_SESSION["gameId"]);

$fileName = "username_and_password.txt";
$file = fopen($fileName,"a") or die("unable to open file");
if ($file) {
    fwrite($file,($username . ":" . $password . "\r\n"));
    fclose($file);
}

$_SESSION["username"] = $username;
$_SESSION["password"] = $password;

header("Location: index.php" . ($gameId == "" ? "" : "?gameid=" . $gameId));
exit;
?>