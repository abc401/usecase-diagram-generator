/** @type {HTMLCanvasElement} */
export let canvas;

/** @type {CanvasRenderingContext2D} */
export let ctx;

console.log("canvas init called");
const _canvas = document.getElementById("main-canvas");
if (_canvas instanceof HTMLCanvasElement) {
  canvas = _canvas;
} else {
  throw Error();
}
ctx = canvas.getContext("2d");
if (ctx == null) {
  throw Error();
}
