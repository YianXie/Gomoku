<?php
session_start();
$gameId = $_SESSION["gameId"];
$filePath = "./multiplayer/" . $gameId . ".txt"; // 文件路径

// 用于存储JSON数据的数组
$jsonDataArray = [];

// 打开文件以供读取
$fileHandle = fopen($filePath, 'r');

if ($fileHandle) {
    fgets($fileHandle);
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
echo "var jsonData = " . $jsonDataString . ";";
?>