<?php
session_start();
$gameId = $_SESSION["gameId"];
$filePath = "./multiplayer/" . $gameId . ".txt"; // 文件路径
$username = htmlspecialchars($_SESSION["username"]);

// 用于存储JSON数据的数组
$jsonDataArray = [];

// 打开文件以供读取
$fileHandle = fopen($filePath, 'r');

$opponentColor;
$opponentName;
$myColor;

if ($fileHandle) {
    // fgets($fileHandle);
    $firstLine = trim(fgets($fileHandle));
    if (!$firstLine) {
		// fwrite($fileHandle,$gameId . " " . $username . " ");
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
    while (($line = fgets($fileHandle)) !== false) {
        // 解析每一行的JSON数据
        $jsonData = json_decode($line, true);

        if ($jsonData !== null) {
            // 将JSON数据添加到数组
            $jsonDataArray[] = $jsonData;
            // echo "console.log('$jsonData')";
        }
    }

    // 关闭文件句柄
    fclose($fileHandle);
}

// 将JSON数据数组编码为JSON字符串
$jsonDataString = json_encode($jsonDataArray);

// 输出JSON字符串
echo "var opponentName = \"" . $opponentName . "\";\r\n";
echo "var opponentColor = \"" . $opponentColor . "\";\r\n";
echo "var myColor = \"" . $myColor . "\";\r\n";
echo "var jsonData = " . $jsonDataString . ";\r\n";
echo "updatePlayers();\r\n";
?>