// 全局变量声明
var board = new Array(); // 用于储存面板信息
var hasConflicted = new Array(); // 用于储存格子是否发生碰撞
var score = 0; // 用于储存分数
var success = false; // 用于储存是否已经达成2048

$(document).ready(function(){
    newgame();
});

// 新游戏
function newgame(){
    // 初始化
    init();
    // 随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

// 初始化
function init(){
    // 初始化单元格位置
    for (var i = 0; i < 4; i++){
        for (var j = 0 ; j < 4; j++){
            var $gridCell = $("#grid-cell-" + i + "-" + j);
            $gridCell.css('top',getPosition(i));
            $gridCell.css('left',getPosition(j));
        }
    }

    // 初始化一个二维数组用于储存游戏面板board信息
    for (var i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array;
        for (var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    // 初始化分数
    score = 0;
    // 初始化成就
    success = false;

    // 绘制数字面板
    updateBoardView();
    // 绘制分数
    updateScore(score);
}

// 绘制数字面板函数
function updateBoardView() {
    // 移除所有数字面板
    $(".number-cell").remove();
    // 遍历board绘制
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            // 创建当前项对应的空的数字单元格
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
            // 获得当前数字单元格
            var $theNumberCell = $('#number-cell-' + i + '-' + j);

            // 判断当前数字是否为0，为0则只占位，不为0则绘制
            if(board[i][j] == 0){
                $theNumberCell.css("width","0px");
                $theNumberCell.css("height","0px");
                $theNumberCell.css("top",getPosition(i) + 50);
                $theNumberCell.css("left",getPosition(j) + 50);
            }else{
                $theNumberCell.css('width', '100px');
                $theNumberCell.css('height', '100px');
                $theNumberCell.css('top', getPosition(i));
                $theNumberCell.css('left', getPosition(j));
                // 根据数字判断填充的单元格和数字颜色
                $theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                $theNumberCell.css('color', getNumberColor(board[i][j]));
                // 根据当前数字的长度设置字体大小
                $theNumberCell.css('font-size',getNumberFontSize(board[i][j]));
                // 填入数字
                $theNumberCell.text(board[i][j]);
            }

            // 设置所有单元格为未碰撞状态false
            hasConflicted[i][j] = false;
        }
    }
}

function test(){
    var $theNumberCells = $('.number-cell');
    $theNumberCells.css('font-size','40px');
}

// 随机在一个空格子上生成数字
function generateOneNumber(){
    // 如果没有空格子,则失败
    if (nospace(board)){
        return false;
    }

    // 随机生成一个位置
    // 设置一个计次参数，随机生成50次空位置
    var times = 0;
    while (times < 50){
        // 随机一个坐标
        var randx = parseInt(Math.floor(Math.random()*4));
        var randy = parseInt(Math.floor(Math.random()*4));
        // 判断是否为空位置,是则结束
        if (board[randx][randy] == 0){
            break;
        }
        // 否则再来一次
        times++;
    }
    // 如果50次都没有生成空位置，则手动寻找一个
    if (times == 50){
        // 遍历并找到所有空余位置并把其中的最后一格找出来
        for (var i = 0; i < 4; i++){
            for (var j =0; j < 4; j++){
                if (board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    // 随机生成一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    // 在生成的这个位置上显示这个数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

// 绘制分数
function updateScore(score){
    switchScoreWithAnimation(score);
}

// ------------------------------------------------------
// 处理键盘上下左右
$(document).keydown(function(e){
    e.preventDefault(); // 关闭浏览器响应键盘的基本功能（上下左右会触发窗口移动）
    switch (e.keyCode) { // 获得按下的按键代码
        case 65:
        case 37:
            // 左
            if (moveLeft()){ // 如果成功执行了向左移动（moveLeft()返回true）
                setTimeout(generateOneNumber,210); // 延迟210毫秒（等待动画完成）生成数字
                setTimeout(is2048,250); // 延迟250毫秒判断是否达成2048
                setTimeout(isgameover,300); // 延迟300毫秒判断游戏是否结束
            }
            break;
        case 87:
        case 38:
            // 上
            if (moveUp()){
                setTimeout(generateOneNumber,210);
                setTimeout(is2048,250);
                setTimeout(isgameover,300);
            }
            break;
        case 68:
        case 39:
            // 右
            if (moveRight()){
                setTimeout(generateOneNumber,210);
                setTimeout(is2048,250);
                setTimeout(isgameover,300);
            }
            break;
        case 83:
        case 40:
            // 下
            if (moveDown()){
                setTimeout(generateOneNumber,210);
                setTimeout(is2048,250);
                setTimeout(isgameover,300);
            }
            break;
        default:
            break;
    }
})

// -----------------------------------------------------------------------------------------

// 向左移动
function moveLeft(){
    // 先判断能否向左移动
    if (!canMoveLeft(board)){
        return false;
    }

    // 如果可以移动
    /* 按行遍历board的每行后三格
     * ①该格子为0，则不进行移动
     * ②该格子左侧（从左到右依次判断）的格子和该格子之间全部是空格子 且也为空
     * ③该格子左侧（从左到右依次判断）的格子和该格子之间全部是空格子 且和该格数字相同
    */
    for (var i = 0; i < 4; i++){
        for (var j = 1; j < 4; j++){
            // ①判断该格子是否为0
            if(board[i][j] != 0){
                // 遍历该格左侧的格子
                for (var k = 0; k < j; k++){
                    // 两个格子之间是否有空格
                    if (noBlockHorizontal(i, k, j, board)){
                        // 如果移动目标为空
                        if(board[i][k] == 0){
                            // 则移动
                            // 移动动画
                            showMoveAnimation(i, j, i, k);
                            // 更改数据
                            board[i][k] = board [i][j];
                            board[i][j] = 0;
                            continue;
                        // 如果移动目标和该格数字相同
                        }else if(board[i][k] == board[i][j] && !hasConflicted[i][k]){
                            // 则相加
                            // 移动动画
                            showMoveAnimation(i, j, i, k);
                            // 更改数据
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            hasConflicted[i][k] = true
                            // 增加分数
                            score += board[i][k];
                            updateScore(score);
                            continue;
                        }
                    }
                }
            }
        }
    }
    // 绘制面板
    setTimeout(updateBoardView,200);
    return true;
}

// 向右移动
function moveRight(){
    // 先判断能否向右移动
    if (!canMoveRight(board)){
        return false;
    }

    // 如果可以移动
    // 按行遍历board的每行前三格(从右到左)
    for (var i = 0; i < 4; i++){
        for (var j = 2; j > -1; j--){
            // ①判断该格子是否为0
            if(board[i][j] != 0){
                // 遍历该格右侧的格子(从右到左)
                for (var k = 3; k > j; k--){
                    // 两个格子之间是否有空格
                    if (noBlockHorizontal(i, j, k, board)){
                        // 如果移动目标为空
                        if(board[i][k] == 0){
                            // 则移动
                            // 移动动画
                            showMoveAnimation(i, j, i, k);
                            // 更改数据
                            board[i][k] = board [i][j];
                            board[i][j] = 0;
                            continue;
                        // 如果移动目标和该格数字相同
                        }else if(board[i][k] == board[i][j] && !hasConflicted[i][k]){
                            // 则相加
                            // 移动动画
                            showMoveAnimation(i, j, i, k);
                            // 更改数据
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            hasConflicted[i][k] = true
                            // 增加分数
                            score += board[i][k];
                            updateScore(score);
                            continue;
                        }
                    }
                }
            }
        }
    }
    // 绘制面板
    setTimeout(updateBoardView,200);
    return true;
}

// 向上移动
function moveUp(){
    // 先判断能否向左移动
    if (!canMoveUp(board)){
        return false;
    }

    // 如果可以移动
    // 按列遍历board的每列后三格
    for (var j = 0; j < 4; j++){
        for (var i = 1; i < 4; i++){
            // ①判断该格子是否为0
            if(board[i][j] != 0){
                // 遍历该格上侧的格子
                for (var k = 0; k < i; k++){
                    // 两个格子之间是否有空格
                    if (noBlockVertical(j, k, i, board)){
                        // 如果移动目标为空
                        if(board[k][j] == 0){
                            // 则移动
                            // 移动动画
                            showMoveAnimation(i, j, k, j);
                            // 更改数据
                            board[k][j] = board [i][j];
                            board[i][j] = 0;
                            continue;
                        // 如果移动目标和该格数字相同
                        }else if(board[k][j] == board[i][j] && !hasConflicted[k][j]){
                            // 则相加
                            // 移动动画
                            showMoveAnimation(i, j, k, j);
                            // 更改数据
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            hasConflicted[k][j] = true
                            // 增加分数
                            score += board[k][j];
                            updateScore(score);
                            continue;
                        }
                    }
                }
            }
        }
    }
    // 绘制面板
    setTimeout(updateBoardView,200);
    return true;
}

// 向下移动
function moveDown(){
    // 先判断能否向下移动
    if (!canMoveDown(board)){
        return false;
    }

    // 如果可以移动
    // 按列遍历board的每列前三格(从下到上)
    for (var j = 0; j < 4; j++){
        for (var i = 3; i > -1; i--){
            // ①判断该格子是否为0
            if(board[i][j] != 0){
                // 遍历该格下侧的格子(从下到上)
                for (var k = 3; k > i; k--){
                    // 两个格子之间是否有空格
                    if (noBlockVertical(j, i, k, board)){
                        // 如果移动目标为空
                        if(board[k][j] == 0){
                            // 则移动
                            // 移动动画
                            showMoveAnimation(i, j, k, j);
                            // 更改数据
                            board[k][j] = board [i][j];
                            board[i][j] = 0;
                            continue;
                        // 如果移动目标和该格数字相同
                        }else if(board[k][j] == board[i][j] && !hasConflicted[k][j]){
                            // 则相加
                            // 移动动画
                            showMoveAnimation(i, j, k, j);
                            // 更改数据
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            hasConflicted[k][j] = true
                            // 增加分数
                            score += board[k][j];
                            updateScore(score);
                            continue;
                        }
                    }
                }
            }
        }
    }
    // 绘制面板
    setTimeout(updateBoardView,200);
    return true;
}

// ------------------------------------------------------
// 判断游戏是否结束
// 游戏结束的条件是：棋盘已经无法移动
function isgameover(){
    if(nomove(board)){
        gameover();
    }
}

// 游戏结束
function gameover(){
    alert("游戏结束！得分：" + score);
}

// -------------------------------------------------------
// 判断成绩是否达到2048
function is2048(){
    if(!success){
        complete2048(board);
    }
}

function complete2048(board){
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if(board[i][j] == 2048){
                alert("2048!");
                success = true;
                return;
            }
        }
    }
}