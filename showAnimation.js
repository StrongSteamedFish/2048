// 显示数字的动画
function showNumberWithAnimation(i, j, number, gridSize){
    // 获取要显示的数字单元格
    var $numberCell = $('#number-cell-' + i + '-' + j + '');
    // 设置CSS和文字内容
    $numberCell.css('background-color',getNumberBackgroundColor(number));
    $numberCell.css('color',getNumberColor(number));
    $numberCell.css('font-size',getNumberFontSize(board[i][j],gridSize));
    $numberCell.css('line-height', gridSize + 'px');
    $numberCell.css('border-radius', 0.06 * gridSize + "px");
    $numberCell.text(number);

    // 设置动画
    $numberCell.animate({
        width: gridSize + "px",
        height: gridSize + "px",
        top: getPosition(i),
        left: getPosition(j)
    }, 200);
}

// 改变分数的动画
function switchScoreWithAnimation(score){
    // 暂时没有动画
    $('#score').text(score);
}

// 移动的动画
function showMoveAnimation(fromx, fromy, tox, toy){
    // 获得移动起始位置
    var $numberCell = $('#number-cell-' + fromx + '-' + fromy);
    // 移动
    $numberCell.animate({
        top: getPosition(tox),
        left: getPosition(toy)
    },200)
}