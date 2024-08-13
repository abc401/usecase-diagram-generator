import { ctx } from "./canvas";
export class UseCase {
  static PADDING = 20;
  /** @type {string} */
  name;

  /**
   * @type {?{
   *   size: number;
   * }}
   */
  dimensions;

  /** @param {string} name */
  constructor(name) {
    this.name = name;
  }

  measure() {
    const measurement = ctx.measureText(this.name);
    const height =
      Math.abs(measurement.actualBoundingBoxAscent) +
      Math.abs(measurement.actualBoundingBoxDescent);
    const width = measurement.width;
    const radius = Math.max(width, height) + padding;
    this.dimensions = {
      size: radius,
    };
  }

  draw() {
    if (this.dimensions == null) {
      this.measure();
    }
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(useCaseName, x - width / 2, y + height / 2);
  }
}
