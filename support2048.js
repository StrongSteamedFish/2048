// 根据序号获得坐标
function getPosition(pos){
    return 20 + pos * 120;
}

// 根据数字获得背景颜色
function getNumberBackgroundColor(number){
    // 如果为2/4则设置为#776e65
    if (number <= 4) {
        return "#776e65";
    }
    return "white";
}

// 根据数字获得数字颜色
function getNumberColor(number) {
    switch(number){
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 3192:
            return "#93c";
            break;
        case 4096:
            return "#a6c";
            break;
    }
    return "black";
}

// 根据数字长度获得字体大小
function getNumberFontSize(number){
    var len = number.toString().length;
    if (len < 3){
        return "60px";
    }else if(len > 2 && len < 6){
        var size = 80 - 10 * len;
        return size + "px";
    }else if(len > 5){
        return "22px";
    }
}


//----------------------------------------------------------------------------
// 判断是否还有空格子
function nospace(board){
    // 遍历board如果出现了空格子，则返回flase,否则返回true
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if (board[i][j] == 0){
                return false;
            }
        }
    }
    return true;
}
//---------------------------------------------------------------------------
// 判断能否向左移动
/* 
 * 1、最左侧一列不需要判断
 * 2、可以移动的条件：
 *  ①当前格子没有数字
 *  ②当前格子的左侧没有数字/数字和当前格子相同
*/
function canMoveLeft(board){
    for (var i = 0; i < 4; i++){
        for (var j = 1; j < 4; j++){
            if (board[i][j] != 0){ // 条件①当前格子有数字
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]){ // ②当前格子的左侧没有数字/数字和当前格子相同
                    return true;
                }
            }
        }
    }
    // 如果一个满足的格子都没有，则返回false
    return false;
}
// 判断能否上下右也和上面类似
function canMoveUp(board){
    for (var i = 1; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if (board[i][j] != 0){ // 条件①当前格子有数字
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]){ // ②当前格子的上侧没有数字/数字和当前格子相同
                    return true;
                }
            }
        }
    }
    // 如果一个满足的格子都没有，则返回false
    return false;
}
function canMoveRight(board){
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 3; j++){
            if (board[i][j] != 0){ // 条件①当前格子有数字
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]){ // ②当前格子的右侧没有数字/数字和当前格子相同
                    return true;
                }
            }
        }
    }
    // 如果一个满足的格子都没有，则返回false
    return false;
}
function canMoveDown(board){
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 4; j++){
            if (board[i][j] != 0){ // 条件①当前格子有数字
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]){ // ②当前格子的下侧没有数字/数字和当前格子相同
                    return true;
                }
            }
        }
    }
    // 如果一个满足的格子都没有，则返回false
    return false;
}

// 棋盘是否可以移动
function nomove(board){
    if(canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board)){
        return false;
    }
    return true;
}

// ----------------------------------------------------------------------------

// 判断水平方向的两个格子之间是否有全为空格
function noBlockHorizontal(row, col1, col2, board){
    // 遍历该行这两个格子中间的格子
    for (var i = col1 + 1; i < col2; i++){
        // 如果有其他数字的格子
        if (board[row][i] != 0){
            return false;
        }
    }
    return true;
}

// 判断垂直方向的两个格子之间是否有全为空格
function noBlockVertical(col, row1, row2, board){
    for (var i = row1 +1; i < row2; i++){
        if (board[i][col] != 0){
            return false;
        }
    }
    return true;
}
