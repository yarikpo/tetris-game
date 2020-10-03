const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const colors = ['#333', '#12ee23', 'gold', '#ee1223', '#1284c6', 'pink'];
var bricks = [];
var figures = [
    [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0]
    ],
    [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2]
    ],
    [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1]
    ],
    [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1]
    ]
];
var timer = 0;
var distance = 0;
var figureX = 0;
var figureType = 1;
var figureColor = '#12ee23';

const SIZE = 50;
const frame = 30;



function changeBrickColor(i, j, color) {
    if (color === colors[0] || bricks[i][j].color === colors[0]) bricks[i][j].color = color;
}

function drawFigure(i, j, figureNumber, color, type) {
    figures[figureNumber].forEach(brick => {
        changeBrickColor(i + brick[1], j + brick[0], color);
        bricks[i + brick[1]][j + brick[0]].type = type;
    });
}

function makeMatrix(size) {
    const cols = canvas.width / size;
    const rows = canvas.height / size;

    for (let i = 0; i < rows; ++i) {
        bricks.push([]);
        for (let j = 0; j < cols; ++j) {
            bricks[i][j] = { type: 0, color: colors[0], size: size };
        }
    }
}

function drawMatrix() {
    for (let i = 0; i < bricks.length; ++i) {
        for (let j = 0; j < bricks[i].length; ++j) {
            drawBrick(bricks[i][j].size * j, bricks[i][j].size * i, bricks[i][j].size, bricks[i][j].color);
        }
    }
}

function drawBrick(x, y, size, color) {
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'silver';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function ifGoDown(i, j, figure) {
    let response = true;
    figure.forEach(fig => {
        if (j + fig[0] >= bricks[i + fig[1]].length || j + fig[0] < 0) {
            response = false;
        }
        else if (i + fig[1] + 1 >= bricks.length  || bricks[i + fig[1] + 1][j + fig[0]].type === 2) {
            response = false;
            drawFigure(i, j, figureType, figureColor, 2);
        }
    });

    return response;
}

function deleteRows() {
    let toDelete = [];
    for (let i = 0; i < bricks.length; ++i) {
        let del = true;
        for (let j = 0; j < bricks[i].length; ++j) {
            if (bricks[i][j].type === 0) del = false;
        }
        if (del) toDelete.push(i);
    }

    toDelete.forEach(row => {
        for (let j = 0; j < bricks[0].length; ++j) {
            bricks[row][j].type = 0;
            bricks[row][j].color = colors[0];
        }
        
        for (let i = row; i > 0; --i) {
            for (let j = 0; j < bricks[i].length; ++j) {
                [bricks[i][j], bricks[i - 1][j]] = [bricks[i - 1][j], bricks[i][j]];
            }
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer++;

    

    if (timer % frame === 0 && ifGoDown(distance, figureX, figures[figureType])) {
        drawFigure(distance, figureX, figureType, colors[0], 0);
        distance++;
    } else if (ifGoDown(distance, figureX, figures[figureType]) === false) {
        distance = 0;
        figureX = 0;

        let min = 0; 
        let max = figures.length;          
        figureType = Math.floor(Math.random() * (max - min)) + min;

        min = 1;
        max = colors.length;
        figureColor = colors[Math.floor(Math.random() * (max - min)) + min];
    }
    
    drawFigure(distance, figureX, figureType, figureColor, 1);
    

    drawMatrix();
    deleteRows();
}

makeMatrix(SIZE);

setInterval(draw, 10);

document.addEventListener('keydown', keydownHandler, false);

function keydownHandler(e) {
    if (e.keyCode === 39) {
        // ->
        if (ifGoDown(distance, figureX + 1, figures[figureType])) {
            drawFigure(distance, figureX, figureType, colors[0], 0);
            figureX++;
        }
    }

    if (e.keyCode === 37) {
        // <-
        if (ifGoDown(distance, figureX - 1, figures[figureType])) {
            drawFigure(distance, figureX, figureType, colors[0], 0);
            figureX--;
        }
    }

    if (e.keyCode === 40) {
        timer = frame - 1;
    }
}