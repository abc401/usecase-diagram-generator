/** @type {HTMLCanvasElement} */
export let canvas;

/** @type {CanvasRenderingContext2D} */
export let ctx;

export function init() {
  canvas = document.getElementById("main-canvas");
  if (canvas == null) {
    throw Error();
  }
  ctx = canvas.getContext("2d");
  if (ctx == null) {
    throw Error();
  }
}
