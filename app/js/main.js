var chessBoard = [];
var me = true;
var over = false;

for(let i=0; i<15; i++) {
    chessBoard[i] = [];
    for(let j=0; j<15; j++) {
        chessBoard[i][j] = 0;
    }
}

var myCanvas = document.getElementById("myCanvas");
var cxt = myCanvas.getContext("2d");

cxt.strokeStyle = "#BFBFBF";
//画棋盘
const drawPanel = function() {
    for(let i=0;i<15;i++) {
        cxt.moveTo(15 + i*30, 15);
        cxt.lineTo(15 + i*30, 435);
        cxt.stroke();
        cxt.moveTo(15, 15 + i*30);
        cxt.lineTo(435, 15 + i*30);
        cxt.stroke();
    }
}

//画棋子
const piece = function(i, j, me) {
    cxt.beginPath();
    cxt.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI);
    cxt.closePath();
    let gradient = cxt.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
    if(me) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    }else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    cxt.fillStyle = gradient;
    cxt.fill();
}

//标注赢的数组
const winLine = function(arr) {
    
}


drawPanel();
// piece(0, 0, true);
// piece(1, 1, false);

//绑定事件
myCanvas.onclick = function(e) {
    if(over) return;
    if(!me) return;
    let x = e.offsetX;
    let y = e.offsetY;
    let i = Math.floor(x / 30);
    let j = Math.floor(y / 30);
    if(chessBoard[i][j] == 0) {
        piece(i, j, me);
        chessBoard[i][j] = 1;
        
        for(let k = 0; k < count; k++) {
            if(wins[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6;
                if(myWin[k] == 5) {
                    over = true;
                    setTimeout(function() {
                        window.alert('你赢了！');
                    }, 200)
                }
            }
        }
        if(!over) {
            me = !me;
            computerAI();
            // me = !me;
        }
    }
}

//赢法统计
var count = 0;
var wins = [];//赢法统计数组
var myWin = [];//我方赢法统计
var computerWin = [];//计算机赢法统计

//初始化
for(let i = 0;i < 15;i++) {
    wins[i] = [];
    for(let j = 0;j < 15; j++) {
        wins[i][j] = [];
    }
}


//横向赢法
for(let i = 0;i < 15;i++) {
    for(let j = 0;j < 11; j++) {
        for(let k = 0;k < 5; k++) {
            wins[i][j+k][count] = true;
        }
        count++;
    }
}
//纵向赢法
for(let i = 0;i < 11;i++) {
    for(let j = 0;j < 15; j++) {
        for(let k = 0;k < 5; k++) {
            wins[i+k][j][count] = true;
        }
        count++;
    }
}

//斜向赢法
for(let i = 0;i < 11;i++) {
    for(let j = 0;j < 11; j++) {
        for(let k = 0;k < 5; k++) {
            wins[i+k][j+k][count] = true;
        }
        count++;
    }
}

//反斜向赢法
for(let i = 4;i < 15;i++) {
    for(let j = 0;j < 11; j++) {
        for(let k = 0;k < 5; k++) {
            wins[i-k][j+k][count] = true;
        }
        count++;
    }
}

for(let i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

var computerAI = function() {
    var myScore = [];
    var computerScore = [];
    var max = 0;
    var u = 0,v = 0;
    for(let i = 0;i < 15;i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for(let j = 0;j < 15;j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for(let i = 0;i < 15;i++) {
        for(let j = 0; j < 15;j++) {
            if(chessBoard[i][j] == 0) {
                for(let k = 0;k < count;k++) {
                    if(wins[i][j][k]) {
                        if(myWin[k] == 1) {
                            myScore[i][j] += 200;
                        }else if(myWin[k] == 2) {
                            myScore[i][j] += 400;
                        }else if(myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        }else if(myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }
                        if(computerWin[k] == 1) {
                            computerScore[i][j] +=220;
                        }else if(computerWin[k] == 2) {
                            computerScore[i][j] +=420;
                        }else if(computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        }else if(computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                
                if(myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }else if(myScore[i][j] == max) {
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                // console.log(max)
                if(computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                }else if(computerScore[i][j] == max) {
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                // console.log(max)
            }
        }
    }
    setTimeout(() => {
        piece(u,v,false);
    },300) 

    chessBoard[u][v] = 2;
    for(let k = 0; k < count; k++) {
        if(wins[u][v][k]) {
            computerWin[k]++;
            myWin[k] = 6;
            if(computerWin[k] == 5) {
                over = true;
                setTimeout(function() {
                    window.alert('计算机赢了！');
                }, 500)
            }
        }
    }
    if(!over) {
        me = !me;
    }
}