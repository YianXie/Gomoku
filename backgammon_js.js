const blocksNumber = 9-1;
let intersectPoint = [];
let black = true;

let game = document.getElementById("gameBoard");
let pen = game.getContext("2d");

const gapVSblocks = 1.2;
const blockSize = game.width/(gapVSblocks+blocksNumber+gapVSblocks);
const gapSize = Math.round(blockSize*gapVSblocks);

function init() {
	drawGame();
	detectClick();
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

function detectClick() {
	let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	window.addEventListener("resize",function() {
		windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	})

	// preview

	// game.addEventListener("mousemove",function(e) {
	// 	let clickPosition = {x:e.screenX - ((windowWidth-game.width)/2)-gapSize,y:e.screenY - ((windowHeight-game.height)/2)-gapSize};
	// 	rowLoop:for (let r=0;r<blocksNumber+1;r++) {
	// 		for (let c=0;c<blocksNumber+1;c++) {
	// 			if (Math.abs(clickPosition.x - intersectPoint[r][c].x) < (game.width-gapSize*2)/blocksNumber/2 && Math.abs(clickPosition.y - intersectPoint[r][c].y) < (game.height-gapSize*2)/blocksNumber/2) {
	// 				if (intersectPoint[r][c].chess == 0) {
	// 					pen.beginPath();
	// 					pen.arc(intersectPoint[r][c].x+gapSize,intersectPoint[r][c].y+gapSize, Math.floor(blockSize*0.4), 0, 2 * Math.PI);
	// 					if (black) {
	// 						pen.fillStyle = "rgba(0,0,0,0.3)";
	// 					} else {
	// 						pen.fillStyle = "rgba(255,255,255,0.3)";
	// 					}
	// 					pen.fill()

	// 					break rowLoop;
	// 				} else {
	// 					return;
	// 				}
	// 			}
	// 		}
	// 	}
	// })

	game.addEventListener("click", function(e) {
		// 相对于整个屏幕的坐标
		const mouseX = e.pageX;
		const mouseY = e.pageY;

		// 相对于棋盘的坐标
		let clickPosition = {x:mouseX-((windowWidth-game.width)/2)-gapSize,y:mouseY-((windowHeight-game.height)/2)-gapSize};

		rowLoop:for (let r=0;r<blocksNumber+1;r++) {
			for (let c=0;c<blocksNumber+1;c++) {
				if (Math.abs(clickPosition.x - intersectPoint[r][c].x) < (game.width-gapSize*2)/blocksNumber/2 && Math.abs(clickPosition.y - intersectPoint[r][c].y) < (game.height-gapSize*2)/blocksNumber/2) {
					if (intersectPoint[r][c].chess == 0) {
						pen.beginPath();
						pen.arc(intersectPoint[r][c].x+gapSize,intersectPoint[r][c].y+gapSize, Math.floor(blockSize*0.4), 0, 2 * Math.PI);
						if (black) {
							pen.fillStyle = "black";
							intersectPoint[r][c].chess = 1;
							checkWin(r,c);
							black = false;
						} else {
							pen.fillStyle = "white";
							intersectPoint[r][c].chess = 2;
							checkWin(r,c);
							black = true;
						}
						pen.fill()

						break rowLoop;
					} else {
						return;
					}
				}
			}
		}
	})
}

function checkWin(r,c) {
	// let win = true;
	if (black) {
		if (r+4 <= blocksNumber) {
			if (intersectPoint[r+1][c].chess == 1 && intersectPoint[r+2][c].chess == 1 && intersectPoint[r+3][c].chess == 1 && intersectPoint[r+4][c].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (r+3 <= blocksNumber && r-1 >= 0) {
			if (intersectPoint[r-1][c].chess == 1 && intersectPoint[r+1][c].chess == 1 && intersectPoint[r+2][c].chess == 1 && intersectPoint[r+3][c].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (r+2 <= blocksNumber && r-2 >= 0) {
			if (intersectPoint[r-2][c].chess == 1 && intersectPoint[r-1][c].chess == 1 && intersectPoint[r+1][c].chess == 1 && intersectPoint[r+2][c].chess == 1) {
				alert("Black won!");
				return;
			}
		} if (r+1 <= blocksNumber && r-3 >= 0) {
			if (intersectPoint[r-3][c].chess == 1 && intersectPoint[r-2][c].chess == 1 && intersectPoint[r+1][c].chess == 1 && intersectPoint[r+1][c].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (r-4 >= 0) {
			if (intersectPoint[r-4][c].chess == 1 && intersectPoint[r-3][c].chess == 1 && intersectPoint[r-2][c].chess == 1 && intersectPoint[r-1][c].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (c+4 <= blocksNumber) {
			if (intersectPoint[r][c+1].chess == 1 && intersectPoint[r][c+2].chess == 1 && intersectPoint[r][c+3].chess == 1 && intersectPoint[r][c+4].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (c+3 <= blocksNumber && c-1 >= 0) {
			if (intersectPoint[r][c-1].chess == 1 && intersectPoint[r][c+1].chess == 1 && intersectPoint[r][c+2].chess == 1 && intersectPoint[r][c+3].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (c+2 <= blocksNumber && c-2 >= 0) {
			if (intersectPoint[r][c-2].chess == 1 && intersectPoint[r][c-1].chess == 1 && intersectPoint[r][c+1].chess == 1 && intersectPoint[r][c+2].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (c+1 <= blocksNumber && c-3 >= 0) {
			if (intersectPoint[r][c-3].chess == 1 && intersectPoint[r][c-2].chess == 1 && intersectPoint[r][c-1].chess == 1 && intersectPoint[r][c+1].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (c-4 >= 0) {
			if (intersectPoint[r][c-4].chess == 1 && intersectPoint[r][c-3].chess == 1 && intersectPoint[r][c-2].chess == 1 && intersectPoint[r][c-1].chess == 1) {
				alert("Black won!");
				return;
			} 
		} if (r+4 <= blocksNumber && c+4 <= blocksNumber) {
			if (intersectPoint[r+1][c+1].chess == 1 && intersectPoint[r+2][c+2].chess == 1 && intersectPoint[r+3][c+3].chess == 1 && intersectPoint[r+4][c+4].chess == 1) {
				alert("Black won!");
				return;
			} 
		} 
	}
}

init();