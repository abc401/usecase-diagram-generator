const _canvas = document.getElementById("main-canvas");
if (_canvas == null) {
  throw Error();
}

export const canvas = _canvas as HTMLCanvasElement;

const _ctx = canvas.getContext("2d");
if (_ctx == null) {
  throw Error();
}

export const ctx = _ctx;

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    canvas.width = entry.contentRect.width;
    canvas.height = entry.contentRect.height;
  }
});
observer.observe(canvas);
