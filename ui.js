console.log("version 2001");

let gIntersectPoint = [];
let gNextPlayerColor = "B"; // 该下的人的颜色

let gGame = document.getElementById("gameBoard");
let gPen = gGame.getContext("2d");
let gPreviewPoint = {};
let windowWidth,windowHeight,mouseX,mouseY;
let gMovesMade = 0; 
let gHighlightChess = {};
let gCanvasWidth,gCanvasHeight;

const gapVSblocks = 1.2;
let blockSize;
let gapSize;

function init() {
	updateSize();
	drawGame();
	window.addEventListener("resize",updateSize);
	
	// Preview`
	gGame.addEventListener("mousemove",oneMouseMove);
	gGame.addEventListener("mousedown",oneMouseDown);
	document.getElementById("gameIdText").addEventListener("mouseover", function() {
		document.getElementById("gameIdText").style.textDecoration = "underline";
		document.getElementById("linkIcon").style.textDecoration = "underline";
	});
	document.getElementById("gameIdText").addEventListener("mouseout", function() {
		document.getElementById("gameIdText").style.textDecoration = "none";
		document.getElementById("linkIcon").style.textDecoration = "none";
	});
	document.addEventListener("mousedown", function(e) {
		if (!document.getElementById("userOptions").contains(e.target)) {
			document.getElementById("userOptions").classList.remove("userOptionsShow");
		}
	});
	waitingForOpponent();
}

function waitingForOpponent() {
	setInterval(function() {
		document.getElementById("waiting").innerHTML = "Waiting for opponent";
	},4000);
	setTimeout(function() {
		setInterval(function() {
			document.getElementById("waiting").innerHTML = "Waiting for opponent.";
		},4000);
	},1000);
	setTimeout(function() {
		setInterval(function() {
			document.getElementById("waiting").innerHTML = "Waiting for opponent..";
		},4000);
	},2000);
	setTimeout(function() {
		setInterval(function() {
			document.getElementById("waiting").innerHTML = "Waiting for opponent...";
		},4000);
	},3000);
}

function userOptions() {
	document.getElementById("userOptions").classList.add("userOptionsShow");
}

function logout() {
	window.location.href = "logout.php";
}

function aboutShow() {
	document.getElementById("about").classList.add("about-show");
}

function aboutClose() {
	document.getElementById("about").classList.remove("about-show");
}

function updateSize() {
	windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	gCanvasWidth = gGame.offsetWidth;
	gCanvasHeight = gGame.offsetHeight;
	blockSize = gCanvasWidth/(gapVSblocks+blocksNumber+gapVSblocks);
	gapSize = Math.round(blockSize*gapVSblocks);
	gGame.width = gCanvasWidth;
	gGame.height = gCanvasHeight;

	gIntersectPoint.length = 0;
	let currentX = 0;
	for (let r=0;r<blocksNumber+1;r++) {
		gIntersectPoint.push([]);
		let currentY = 0;
		for (let c=0;c<blocksNumber+1;c++) {
			gIntersectPoint[r].push({});
			gIntersectPoint[r][c].x = currentX;
			gIntersectPoint[r][c].y = currentY;
			gIntersectPoint[r][c].chess = 0;
			currentY += (gCanvasHeight-gapSize*2)/blocksNumber;
		}
		currentX += (gCanvasWidth-gapSize*2)/blocksNumber;
	}
}

function drawGame() {
	for (let i=0;i<blocksNumber+1;i++) { // draw the columns first
		gPen.moveTo(gapSize + i*blockSize,gapSize);
		gPen.lineTo(gapSize + i*blockSize,gCanvasHeight-gapSize);
		gPen.stroke();
	}

	for (let i=0;i<blocksNumber+1;i++) { // then draw the rows
		gPen.moveTo(gapSize,gapSize + i*blockSize);
		gPen.lineTo(gCanvasWidth-gapSize,gapSize + i*blockSize);
		gPen.stroke();
	}
	gGame.style.backgroundColor = "rgb(212,163,123)"; // set the background color
	drawCoords();
	gameData = gPen.getImageData(0,0,gCanvasWidth,gCanvasHeight);

	// let currentX = 0;
	// for (let r=0;r<blocksNumber+1;r++) {
	// 	gIntersectPoint.push([]);
	// 	let currentY = 0;
	// 	for (let c=0;c<blocksNumber+1;c++) {
	// 		gIntersectPoint[r].push({});
	// 		gIntersectPoint[r][c].x = currentX;
	// 		gIntersectPoint[r][c].y = currentY;
	// 		gIntersectPoint[r][c].chess = 0;
	// 		currentY += (gCanvasHeight-gapSize*2)/blocksNumber;
	// 	}
	// 	currentX += (gCanvasWidth-gapSize*2)/blocksNumber;
	// }
	// console.log(gIntersectPoint);
}

function drawCoords() {
	const xCoordsDistanceToBlocks = Math.round(gapSize/2.3);
	const yCoordsDistanceToBlocks = Math.round(gapSize/1.3);
	const penFont = 20;
	gPen.font = "20px Arial";
	for (let i = 1;i < blocksNumber+2;i++) {
		gPen.fillText(i,gapSize-yCoordsDistanceToBlocks,gapSize + (blocksNumber-(i-1))*blockSize + penFont/3);
	}
	for (let i = "A".charCodeAt(0);i < 66+blocksNumber;i++) {
		gPen.fillText(String.fromCharCode(i),gapSize + (i-65)*blockSize - penFont/3,gapSize-xCoordsDistanceToBlocks);
	}
}

function oneMouseMove(e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
	chessHover(e.pageX,e.pageY);
}

function oneMouseDown(e) {
	if (e.button == 0) {
		// moveChess = false;
		// 相对于整个屏幕的坐标
		const mouseX = e.pageX;
		const mouseY = e.pageY;

		// 相对于棋盘的坐标
		let clickPosition = {x:mouseX-((windowWidth-gCanvasWidth)/2)-gapSize,y:mouseY-((windowHeight-gCanvasHeight)/2)-gapSize};

		rowLoop:for (let r=0;r<blocksNumber+1;r++) {
			for (let c=0;c<blocksNumber+1;c++) {
				if (Math.abs(clickPosition.x - gIntersectPoint[r][c].x) < (gCanvasWidth-gapSize*2)/blocksNumber/2 && Math.abs(clickPosition.y - gIntersectPoint[r][c].y) < (gCanvasHeight-gapSize*2)/blocksNumber/2) {
					if (gIntersectPoint[r][c].chess == 0) {
						const multigNextPlayer_info = {x:r,y:c,color:gNextPlayerColor};
						store_data(JSON.stringify(multigNextPlayer_info),"store_data.php");
						gNextPlayerColor = oneMove(r,c,gNextPlayerColor);
						gameData = gPen.getImageData(0,0,gCanvasWidth,gCanvasHeight);
						// showLastMove(r,c);
						// console.log(intersectPoint);
						gGame.removeEventListener("mousedown",oneMouseDown); 
						gGame.removeEventListener("mousemove",oneMouseMove);
						break rowLoop;
					} else {
						return;
					}
				}
			}
		}
	}
}

function chessHover(x,y,forceDraw = false) {
	let position = {x:x-((windowWidth-gCanvasWidth)/2)-gapSize,y:y-((windowHeight-gCanvasHeight)/2)-gapSize};
	for (let r=0;r<blocksNumber+1;r++) {
		for (let c=0;c<blocksNumber+1;c++) {
			if (Math.abs(position.x - gIntersectPoint[r][c].x) < (gCanvasWidth-gapSize*2)/blocksNumber/2 && Math.abs(position.y - gIntersectPoint[r][c].y) < (gCanvasHeight-gapSize*2)/blocksNumber/2) {
				if (gIntersectPoint[r][c].chess == 0) {
					if ((gPreviewPoint.x != gIntersectPoint[r][c].x || gPreviewPoint.y != gIntersectPoint[r][c].y) || forceDraw) {
						gPreviewPoint.x = gIntersectPoint[r][c].x;
						gPreviewPoint.y = gIntersectPoint[r][c].y;
						gPen.putImageData(gameData,0,0);
						gPen.beginPath();
						gPen.arc(gIntersectPoint[r][c].x+gapSize,gIntersectPoint[r][c].y+gapSize, Math.floor(blockSize*0.4), 0, 2 * Math.PI);
						if (gNextPlayerColor == "B") {
							gPen.fillStyle = "rgba(0,0,0,0.3)";
						} else {
							gPen.fillStyle = "rgba(255,255,255,0.3)";
						}
						gPen.fill()
					} 

					return;
				} 
			}
		}
	}
	gPen.putImageData(gameData,0,0);
}

function oneMove(r,c,nextPlayer,playSound = true) {
	let fillColor;
	if (playSound) {
		document.getElementById("oneMoveAudio").play();
	}
	if (nextPlayer == "B") {
		fillColor = "black";
		gIntersectPoint[r][c].chess = "B";
		nextPlayer = "W";
	} else {
		fillColor = "white";
		gIntersectPoint[r][c].chess = "W";
		nextPlayer = "B";
	}
	drawChess(r,c,fillColor);
	highlight(r,c,fillColor);
	gameResult = checkWin(r,c);
	if (gameResult != "") {
		alert(gameResult);
	}
	gameData = gPen.getImageData(0,0,gCanvasWidth,gCanvasHeight);
	gMovesMade++;
	return nextPlayer;
}

function drawChess(x,y,fillColor) {
	const lastMoveX = gIntersectPoint[x][y].x;
	const lastMoveY = gIntersectPoint[x][y].y;

    gPen.beginPath();
    gPen.arc(lastMoveX+gapSize, lastMoveY+gapSize, Math.floor(blockSize * 0.4), 0, 2 * Math.PI);
    gPen.fillStyle = fillColor;
    gPen.fill();
}

function highlight(x,y,chessColor) {
	let lastMoveX,lastMoveY;
	try {
		if (gHighlightChess.x == x && gHighlightChess.y == y) {
			return;
		} 
		drawChess(gHighlightChess.x,gHighlightChess.y,gHighlightChess.chessColor);
	}
	catch(err) {
		// console.log("first move");
	}

	lastMoveX = gIntersectPoint[x][y].x;
	lastMoveY = gIntersectPoint[x][y].y;

	gPen.beginPath();
	gPen.arc(lastMoveX+gapSize, lastMoveY+gapSize, Math.floor(blockSize * 0.15), 0, 2 * Math.PI);
	gPen.fillStyle = "red";
	gPen.fill();
	
	gHighlightChess.x = x;
	gHighlightChess.y = y;
	gHighlightChess.chessColor = chessColor;
}

function checkLineWin(chessArray) {
	for (let i = 0; i <= chessArray.length - 5; i++) {
	  	if (
			chessArray[i] === gNextPlayerColor &&
			chessArray[i + 1] === gNextPlayerColor &&
			chessArray[i + 2] === gNextPlayerColor &&
			chessArray[i + 3] === gNextPlayerColor &&
			chessArray[i + 4] === gNextPlayerColor
		) {
			if (gNextPlayerColor == "B") {
				return "Black won!";
			}
			return "White won!";
		}
	}
	return "";
}

function checkWin(row,col) {
	// console.log("row:",row,"col:",col);
	let tie = true;
	arrayLoop:for (let i = 0;i<gIntersectPoint.length;i++) {
		for (let r = 0;r<gIntersectPoint[i].length;r++) {
			if (gIntersectPoint[i][r].chess == 0) {
				tie = false;
				break arrayLoop;
			}
		}
	}
	if (tie) {
		alert("It's a tie.");
		return;
	}

	const rowArray = [];
	const colArray = [];
	const diagonalArray1 = []; // from top left to bottom right
	const diagonalArray2 = []; // from top right to bottom left
 
	// get info for colArray and rowArray
	for (let i = 0; i < blocksNumber; i++) {
		colArray.push(gIntersectPoint[row][i].chess);
		rowArray.push(gIntersectPoint[i][col].chess);
	}
	
	// get info for diagonalArray1
	if (row < col) {
		for (let i = 0;i<=blocksNumber-Math.abs(col-row);i++) {
			diagonalArray1.push(gIntersectPoint[i][i+col-row].chess);
		}
	} else if (row > col) {
		for (let i = 0;i<=blocksNumber-Math.abs(col-row);i++) {
			diagonalArray1.push(gIntersectPoint[i+row-col][i].chess);
		}
	} else {
		for (let i = 0;i<blocksNumber;i++) {
			diagonalArray1.push(gIntersectPoint[i][i].chess);
		}
	}

	// get info for diagonalArray2
	if (row+col < blocksNumber) {
		for (let i = 0;i < row+col;i++) {
			diagonalArray2.push(gIntersectPoint[row+col-i][i].chess);
		}
	} else if (row+col == blocksNumber) {
		for (let i = 0;i < blocksNumber;i++) {
			diagonalArray2.push(gIntersectPoint[blocksNumber-i][i].chess);
		}
	} else if (row + col > blocksNumber) {
		for (let i = row + col - blocksNumber; i < blocksNumber; i++) {
			diagonalArray2.push(gIntersectPoint[-i+row+col][i].chess);
		}
	}
	
	// return the msg that checkLineWin returned
	return checkLineWin(rowArray) || checkLineWin(colArray) || checkLineWin(diagonalArray1) || checkLineWin(diagonalArray2);
} 

function store_data(data,phpName) {
	const xhttp = new XMLHttpRequest();

	xhttp.open("POST",phpName,true);
	xhttp.setRequestHeader("content-type","application/json");

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState === 4) {
			if (xhttp.status === 200) {
				console.log(xhttp.responseText);
			} else {
				console.error("Network request error.");
			}
		}
	}

	xhttp.send(data);
}

function copyUrl() {
    var dummy = document.createElement('input'),
    	text = window.location.href;

	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand('copy'); // have to use this because server is on http not https
	document.body.removeChild(dummy);
	showToast();
	setTimeout(hideToast, 2000);
}

function showToast() {
	const toast = document.getElementById("toast");
	if (toast) {
		toast.classList.add("toast-show");
	} else {
		console.error("Can't find toast.");
	}
}

function hideToast() {
	document.getElementById("toast").classList.remove("toast-show");
}

function updatePlayers() {
	if (opponentName != "" && opponentName != undefined) {
		if (opponentColor == "B") {
			document.getElementById("players").innerHTML = "<i class='bx bx-circle' ></i>" + username + " vs. " + "<i class='bx bxs-circle'></i>" + opponentName ;
		} else {
			document.getElementById("players").innerHTML = "<i class='bx bxs-circle'></i>" + username + " vs. " + "<i class='bx bx-circle' ></i>"  + opponentName ;
		}
		document.getElementById("tips").remove();
	}
	const linkIcon = "<i class='bx bx-link' id='linkIcon' onclick='copyUrl()' style='color: blue;'></i>";
	document.getElementById("gameIdText").innerHTML = "ID: " + gameId + linkIcon;
}

function include(filename,callback) {
	try {
		document.getElementById("read_chess_info").remove();
	}
	catch(err) {

	}
    var script = document.createElement('script');
	script.id = "read_chess_info";
    script.src = filename;
	script.onload = callback;
    document.head.appendChild(script);
}

init();

// 引入PHP生成的JSON数据
setInterval(function() {include('read_chess_info.php',function() {
	// 现在，您可以在JavaScript中访问JSON数据的具体字段
	if (gMovesMade < jsonData.length) {
		gGame.addEventListener("mousedown",oneMouseDown);
		gGame.addEventListener("mousemove",oneMouseMove);
	} 
	gPen.putImageData(gameData,0,0);
	for (var moveNumber = 0; moveNumber < jsonData.length; moveNumber++) {
		// console.log(jsonData[i]);
		if (moveNumber < gMovesMade) {
			continue;
		} 
		oneMove(jsonData[moveNumber].x,jsonData[moveNumber].y,jsonData[moveNumber].color,false);
		if (jsonData[moveNumber].color == "B") {
			gNextPlayerColor = "W";
		} else {
			gNextPlayerColor = "B";
		}
	}
	if ( gNextPlayerColor != myColor ) {
		gGame.removeEventListener("mousedown",oneMouseDown);
		gGame.removeEventListener("mousemove",oneMouseMove);
	}
	gameData = gPen.getImageData(0,0,gCanvasWidth,gCanvasHeight);
	chessHover(mouseX,mouseY,true);
})},250);
