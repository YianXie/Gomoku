console.log("version 1024");
let intersectPoint = [];
let nextPlayer = "B"; // 该下的人的颜色

let game = document.getElementById("gameBoard");
let pen = game.getContext("2d");
let previewPoint = {};
let windowWidth,windowHeight,mouseX,mouseY;
let movesMade = 0; 
let highlightChess = {};

const gapVSblocks = 1.2;
const blockSize = game.width/(gapVSblocks+blocksNumber+gapVSblocks);
const gapSize = Math.round(blockSize*gapVSblocks);


function init() {
	drawGame();
	detectClick();
}

const date = new Date();
function generateGameId() {
	const gameId = date.getTime() + Math.floor(Math.random() * 10);
	return gameId;
}

function drawGame() {
	for (let i=0;i<blocksNumber+1;i++) { // draw the columns first
		pen.moveTo(gapSize + i*blockSize,gapSize);
		pen.lineTo(gapSize + i*blockSize,game.height-gapSize);
		pen.stroke();
	}

	for (let i=0;i<blocksNumber+1;i++) { // then draw the rows
		pen.moveTo(gapSize,gapSize + i*blockSize);
		pen.lineTo(game.width-gapSize,gapSize + i*blockSize);
		pen.stroke();
	}
	game.style.backgroundColor = "rgb(212,163,123)"; // set the background color
	drawCoords();
	gameData = pen.getImageData(0,0,game.width,game.height);

	let currentX = 0;
	for (let r=0;r<blocksNumber+1;r++) {
		intersectPoint.push([]);
		let currentY = 0;
		for (let c=0;c<blocksNumber+1;c++) {
			intersectPoint[r].push({});
			intersectPoint[r][c].x = currentX;
			intersectPoint[r][c].y = currentY;
			intersectPoint[r][c].chess = 0;
			currentY += (game.height-gapSize*2)/blocksNumber;
		}
		currentX += (game.width-gapSize*2)/blocksNumber;
	}
}

function drawCoords() {
	const xCoordsDistanceToBlocks = Math.round(gapSize/2.3);
	const yCoordsDistanceToBlocks = Math.round(gapSize/1.3);
	const penFont = 20;
	pen.font = "20px Arial";
	for (let i = 1;i < blocksNumber+2;i++) {
		pen.fillText(i,gapSize-yCoordsDistanceToBlocks,gapSize + (blocksNumber-(i-1))*blockSize + penFont/3);
	}
	for (let i = "A".charCodeAt(0);i < 66+blocksNumber;i++) {
		pen.fillText(String.fromCharCode(i),gapSize + (i-65)*blockSize - penFont/3,gapSize-xCoordsDistanceToBlocks);
	}
}

function detectClick() {
	windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	window.addEventListener("resize",function() {
		windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	})

	// Preview
	game.addEventListener("mousemove",oneMouseMove);

	game.addEventListener("mousedown",oneMouseDown);
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
		let clickPosition = {x:mouseX-((windowWidth-game.width)/2)-gapSize,y:mouseY-((windowHeight-game.height)/2)-gapSize};

		rowLoop:for (let r=0;r<blocksNumber+1;r++) {
			for (let c=0;c<blocksNumber+1;c++) {
				if (Math.abs(clickPosition.x - intersectPoint[r][c].x) < (game.width-gapSize*2)/blocksNumber/2 && Math.abs(clickPosition.y - intersectPoint[r][c].y) < (game.height-gapSize*2)/blocksNumber/2) {
					if (intersectPoint[r][c].chess == 0) {
						const multinextPlayer_info = {x:r,y:c,color:nextPlayer};
						store_data(JSON.stringify(multinextPlayer_info),"store_data.php");
						nextPlayer = oneMove(r,c,nextPlayer);
						gameData = pen.getImageData(0,0,game.width,game.height);
						// showLastMove(r,c);
						// console.log(intersectPoint);
						game.removeEventListener("mousedown",oneMouseDown); 
						game.removeEventListener("mousemove",oneMouseMove);
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
	let position = {x:x-((windowWidth-game.width)/2)-gapSize,y:y-((windowHeight-game.height)/2)-gapSize};
	for (let r=0;r<blocksNumber+1;r++) {
		for (let c=0;c<blocksNumber+1;c++) {
			if (Math.abs(position.x - intersectPoint[r][c].x) < (game.width-gapSize*2)/blocksNumber/2 && Math.abs(position.y - intersectPoint[r][c].y) < (game.height-gapSize*2)/blocksNumber/2) {
				if (intersectPoint[r][c].chess == 0) {
					if ((previewPoint.x != intersectPoint[r][c].x || previewPoint.y != intersectPoint[r][c].y) || forceDraw) {
						previewPoint.x = intersectPoint[r][c].x;
						previewPoint.y = intersectPoint[r][c].y;
						pen.putImageData(gameData,0,0);
						pen.beginPath();
						pen.arc(intersectPoint[r][c].x+gapSize,intersectPoint[r][c].y+gapSize, Math.floor(blockSize*0.4), 0, 2 * Math.PI);
						if (nextPlayer == "B") {
							pen.fillStyle = "rgba(0,0,0,0.3)";
						} else {
							pen.fillStyle = "rgba(255,255,255,0.3)";
						}
						pen.fill()
					} 

					return;
				} 
			}
		}
	}
	pen.putImageData(gameData,0,0);
}
// oneMove($gameInfo["x"],$gameInfo["y"],$gameInfo["nextPlayer"]);
function oneMove(r,c,nextPlayer,playSound = true) {
	let fillColor;
	if (playSound) {
		document.getElementById("oneMoveAudio").play();
	}
	// pen.beginPath();
	// pen.arc(intersectPoint[r][c].x+gapSize,intersectPoint[r][c].y+gapSize, Math.floor(blockSize*0.4), 0, 2 * Math.PI);
	if (nextPlayer == "B") {
		fillColor = "black";
		intersectPoint[r][c].chess = "B";
		nextPlayer = "W";
	} else {
		fillColor = "white";
		intersectPoint[r][c].chess = "W";
		nextPlayer = "B";
	}
	// pen.fill();
	drawChess(r,c,fillColor);
	highlight(r,c,fillColor);
	checkWin(r,c);
	gameData = pen.getImageData(0,0,game.width,game.height);
	movesMade++;
	return nextPlayer;
}

function drawChess(x,y,fillColor) {
	const lastMoveX = intersectPoint[x][y].x;
	const lastMoveY = intersectPoint[x][y].y;

    pen.beginPath();
    pen.arc(lastMoveX+gapSize, lastMoveY+gapSize, Math.floor(blockSize * 0.4), 0, 2 * Math.PI);
    pen.fillStyle = fillColor;
    pen.fill();
}

function highlight(x,y,chessColor) {
	let lastMoveX,lastMoveY;
	try {
		if (highlightChess.x == x && highlightChess.y == y) {
			return;
		} 
		drawChess(highlightChess.x,highlightChess.y,highlightChess.chessColor);
	}
	catch(err) {
		console.log("first move");
	}

	lastMoveX = intersectPoint[x][y].x;
	lastMoveY = intersectPoint[x][y].y;

	pen.beginPath();
	pen.arc(lastMoveX+gapSize, lastMoveY+gapSize, Math.floor(blockSize * 0.15), 0, 2 * Math.PI);
	pen.fillStyle = "red";
	pen.fill();
	
	highlightChess.x = x;
	highlightChess.y = y;
	highlightChess.chessColor = chessColor;
}

function checkLineWin(chessArray) {
	for (let i = 0; i <= chessArray.length - 5; i++) {
	  	if (
			chessArray[i] === nextPlayer &&
			chessArray[i + 1] === nextPlayer &&
			chessArray[i + 2] === nextPlayer &&
			chessArray[i + 3] === nextPlayer &&
			chessArray[i + 4] === nextPlayer
		) {
			if (nextPlayer == "B") {
				alert("Black won!");
			} else {
				alert("White won!");
			}
		}
	}
}

function checkWin(row,col) {
	let tie = true;
	arrayLoop:for (let i = 0;i<intersectPoint.length;i++) {
		for (let r = 0;r<intersectPoint[i].length;r++) {
			if (intersectPoint[i][r].chess == 0) {
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
	// const diagonalArray1 = [];
	// const diagonalArray2 = [];
	for (let i = 0; i < blocksNumber; i++) {
		colArray.push(intersectPoint[row][i].chess);
		rowArray.push(intersectPoint[i][col].chess);
	}

	// if (row < col) {
	// 	for (let i = 0;i <= blocksNumber-(col-row);i++) {
	// 		diagonalArray1.push(intersectPoint[i][i].chess);
	// 	}
	// } else if (row > col) {
	// 	for (let i = 0;i <= blocksNumber-(row-col);i++) {
	// 		diagonalArray1.push(intersectPoint[i][i].chess);
	// 	}
	// } else {
	// 	for (let i = 0;i <= blocksNumber;i++) {
	// 		diagonalArray1.push(intersectPoint[i][i].chess);
	// 	}
	// }

	// console.log(row,col);
	// console.log("array 1:",diagonalArray1);

	checkLineWin(rowArray) ||
	checkLineWin(colArray)
	// checkLineWin(diagonalArray1) ||
	// checkLineWin(diagonalArray2)
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
				console.error("网络请求失败");
			}
		}
	}

	xhttp.send(data);
}

function include(filename,callback) {
    var script = document.createElement('script');
    script.src = filename;
	script.onload = callback;
    document.head.appendChild(script);
}

init();

// 引入PHP生成的JSON数据
setInterval(function() {include('read_chess_info.php',function() {
	// 现在，您可以在JavaScript中访问JSON数据的具体字段
	if (movesMade < jsonData.length) {
		game.addEventListener("mousedown",oneMouseDown);
		game.addEventListener("mousemove",oneMouseMove);
	} 
	pen.putImageData(gameData,0,0);

	for (var moveNumber = 0; moveNumber < jsonData.length; moveNumber++) {
		// console.log(jsonData[i]);
		if (moveNumber < movesMade) {
			continue;
		} 
		oneMove(jsonData[moveNumber].x,jsonData[moveNumber].y,jsonData[moveNumber].color,false);
		if (jsonData[moveNumber].color == "B") {
			nextPlayer = "W";
		} else {
			nextPlayer = "B";
		}
	}
	gameData = pen.getImageData(0,0,game.width,game.height);
	chessHover(mouseX,mouseY,true);
})},100);
