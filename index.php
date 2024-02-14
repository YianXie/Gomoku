<?php 
session_start();

if (isset($_GET["gameid"])) {
	$gameId = $_GET["gameid"];
	$_SESSION["gameId"] = $gameId;
} else {
	while (true) {
		$gameId = rand(1,9999);
		$fileName = "./multiplayer/" . $gameId . ".txt";
		$file = fopen($fileName,"r");
		if (!$file) {
			break;
		}
		fclose($file);
	}
	header("Location: index.php?gameid=" . $gameId);
	exit;
}

$username = $_SESSION["username"];
if ($username == "") {
	header("Location: login.php?gameid=" . $gameId);
	exit;
}

// $cookie_name = "user";
// $cookie_value = $username;
// setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
// if (isset($_COOKIE[$cookie_name])) {
// 	echo "Cookie name: '" . $cookie_name . "'is set!<br>";
// 	echo "Value is: '" . $_COOKIE[$cookie_name];
// } else {
// 	echo "Cookie name: '" . $cookie_name . "' is not set!<br>";
// }

$blocksNumber = 13-1;
$opponentColor;
$myColor;

$_SESSION["blocksNumber"] = $blocksNumber;
$fileName = "./multiplayer/" . $gameId . ".txt";
$file = fopen($fileName,"c+") or die("unable to open file" . $fileName);
if ($file) {
	if (!($firstLine = trim(fgets($file)))) {
		fwrite($file,$gameId . " " . $username . " ");
	} else {
		$firstLineData = explode(" ",$firstLine);
		if (count($firstLineData) == 5) {
			// there are already 2 players
			if ($firstLineData[1] == $username) {
				$myColor = $firstLineData[3];
				$opponentName = $firstLineData[2];
				$opponentColor = $firstLineData[4];
			} else if ($firstLineData[2] == $username) {
				$myColor = $firstLineData[4];
				$opponentName = $firstLineData[1];
				$opponentColor = $firstLineData[3];
			} else {
				// watch mode
			}
		} else if (count($firstLineData) == 2) {
			// Someone is already here
			if ($firstLineData[1] != $username) {
				$opponentName = $firstLineData[1];
				if (rand(1,2) == 1) {
					$opponentColor = "B";
					$myColor = "W";
				} else {
					$opponentColor = "W";
					$myColor = "B";
				}
				fwrite($file, $username . " " . $opponentColor . " " . $myColor . "\r\n");
			}
		} else {
			echo "File content error:" . $firstLine;
		}
	}
	fclose($file);
}
?>
<!Doctype html>
<html>
<head>
	<title>Gomoku</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="expires" content="0">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
	<link rel="stylesheet" type="text/css" href="index.css">
	<link rel="icon" href="favicon.ico" type="image/x-icon" sizes="16x16 32x32 48x48 64x64">
	<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
	<a href="register.php" class="user" id="userId">User</a>
	<div class="userOptions" id="userOptions">
		<a href="javascript:logout()" class="log-out"><i class='bx bx-log-out'></i> Logout</a>
		<br>
		<hr>
		<a href="javascript:aboutShow()" class="about-button"><i class='bx bxs-help-circle'></i> About</a>
	</div>
	<div class="about" id="about">
		<i class='bx bx-x' onclick="aboutClose()"></i>
		<h1 class="about-title">About Gomoku</h1>
		Gomoku is a strategy board game. Also called Five in a Row, it is traditionally played with Go pieces (black and white stones) on a go board with 19x19 (15x15) intersections. The game is known in several countries under different names. 
		Black plays first, and players alternate in placing a stone of their color on an empty intersection. The winner is the first player to get an unbroken row of five stones horizontally, vertically, or diagonally.
		The game is a draw if the board is filled before either player wins.
	</div>
	<div class="multiplayer-options">
		<span id="gameIdText" class="game-id" onclick="copyUrl()"></span> <!-- <span id="changeRoomNumber" class="change-room-number"></span> -->
		<p id="players" class="players"></p>
		<!-- <div class="tips" id="tips">
			<p class="user-tips">Share the <a href="javascript:copyUrl()">url</a> to your friend to play together</p>
			<p class="waiting-for-opponent" id="waiting">Waiting for opponent...</p>
		</div> -->
	</div>
	<div class="toast" id="toast">
		<span class="toast-text"><i class='bx bxs-check-circle'></i>copied!</span>
	</div>
	<canvas id="gameBoard" width="700" height="700" oncontextmenu="return false"></canvas>
	<audio id="oneMoveAudio">
		<source src="one_move.mp3" type="audio/mpeg">
	</audio>
	<script>
		const blocksNumber = <?php echo json_encode($blocksNumber); ?>;
		const username = "<?php echo $_SESSION["username"]; ?>";
		const gameId = <?php echo "\"" . $gameId . "\";\r\n"; ?>

		const userButton = document.getElementById("userId");
		userButton.innerHTML = "<i class='bx bxs-user-circle'></i>" + username;
		userButton.href = "javascript:userOptions()";
	</script>
	<script src="ui.js"></script>
</body>
</html>