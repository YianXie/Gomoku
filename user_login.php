<?php 
session_start();
$username = htmlspecialchars($_POST["username"]);
$username = strtolower($username);
$password = htmlspecialchars($_POST["password"]);
$gameId = htmlspecialchars($_SESSION["gameId"]);

$fileName = "username_and_password.txt";
$file = fopen($fileName,"r") or die("unable to open file");
$loggedIn = false;

if ($file) {
    while ($line = fgets($file)) {
        $line = trim($line);
        $usernameAndPasswordArray = explode(":",$line);
        if ($username == strtolower($usernameAndPasswordArray[0]) && $password == $usernameAndPasswordArray[1]) {
            $loggedIn = true;
            session_unset();
            $_SESSION["username"] = $username;
            $url = "Location: index.php?gameid=" . $gameId;
            header($url);
            exit;
        }
    }
    if (!$loggedIn) {
        header("Location: login.php?error=true");
        exit;
    }
}
?>