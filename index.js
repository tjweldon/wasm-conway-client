import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import * as P5 from "p5"

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";


// Construct the universe, and get its width and height.
const universe = Universe.new_sized(128, 128);
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas_height = (CELL_SIZE + 1) * height + 1;
const canvas_width = (CELL_SIZE + 1) * width + 1;

// convenience function to convert from (row, column) index pair to the
// index in the linear array of cells
const getIndex = (row, column) => {
    return row * width + column;
};

let s = (sk) => {
    sk.disableFriendlyErrors = true;

    sk.setup = () => {
        sk.createCanvas(canvas_width, canvas_height)
        sk.background(DEAD_COLOR)
        sk.draw_grid()
    }

    sk.draw_grid = () => {
        sk.strokeWeight(1);
        sk.stroke(GRID_COLOR)
        for (let i = 0; i <= width; i++) {
            let x1 = i * (CELL_SIZE + 1) + 0.5;
            sk.line(x1, 0, x1, canvas_height)
        }

        for (let j = 0; j <= height; j++) {
            let y1 = j * (CELL_SIZE + 1) + 0.5;
            sk.line(0, y1, canvas_width, y1)
        }
    }

    sk.fill_cells = (cells, colour, exclude_value) => {
        sk.fill(colour)
        sk.noStroke();
        for (let row = 0; row < height; row++) {
            let y = row * (CELL_SIZE + 1) + 1;
            for (let col = 0; col < width; col++) {
                const idx = getIndex(row, col);
                if (cells[idx] === exclude_value) {
                    continue;
                }
                let x = col * (CELL_SIZE + 1) + 1;
                sk.rect(x, y, CELL_SIZE, CELL_SIZE)
            }
        }
    }

    sk.fill_live_cells = (cells) => {
        sk.fill_cells(cells, ALIVE_COLOR, Cell.Dead)
    }

    sk.fill_dead_cells = (cells) => {
        sk.fill_cells(cells, DEAD_COLOR, Cell.Alive)
    }

    sk.draw = () => {
        const cellsPtr = universe.cells();
        const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
        sk.noStroke()
        sk.fill(256)
        sk.rect(0, 0, canvas_width, canvas_height)
        sk.draw_grid()
        sk.fill_live_cells(cells)
        universe.tick()
    }
}

const p5 = new P5(s);



// ------------------------
// Interactivity functions
// ------------------------

// This event listener handles the toggling of cells in the game grid
// canvas.addEventListener("click", event => {
//     const boundingRect = canvas.getBoundingClientRect();
//
//     const scaleX = canvas.width / boundingRect.width;
//     const scaleY = canvas.height / boundingRect.height;
//
//     const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
//     const canvasTop = (event.clientY - boundingRect.top) * scaleY;
//
//     const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
//     const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
//
//     universe.toggle_cell(row, col);
//
//     drawGrid();
//     drawCells();
// });
//
// const isPaused = () => {
//     return animationId === null;
// };
//
// const play = () => {
//     playPauseButton.textContent = "⏸";
//     renderLoop();
// };
//
// const pause = () => {
//     playPauseButton.textContent = "▶";
//     cancelAnimationFrame(animationId);
//     drawGrid();
//     drawCells();
//     animationId = null;
// };

// Binding the interactivity to the ui via the button
// const playPauseButton = document.getElementById("play-pause");
//
// playPauseButton.addEventListener("click", event => {
//     if (isPaused()) {
//         play();
//     } else {
//         pause();
//     }
// });

// -----------------
// Main render loop
// -----------------

// let animationId = null;
// const renderLoop = () => {
//     fps.render();
//
//     universe.tick();
//     // drawGrid();
//     drawCells();
//     animationId = requestAnimationFrame(renderLoop);
// };

// Starts the main render loop
// play();
// pause();
