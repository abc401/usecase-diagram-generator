import { ctx } from "./canvas.js";
import { Vec2 } from "./vec2.js";
let x = 200;
let y = 200;

export class UseCase {
  static PADDING = 20;
  /** @type {string} */
  name;

  /** @type {Vec2} */
  pos;

  /**
   * @type {?{
   *   radius: number;
   *   textWidth: number;
   *   textHeight: number;
   * }}
   */
  dimensions;

  focused = false;

  /** @param {string} name */
  constructor(name) {
    this.name = name;
    this.pos = new Vec2(x, y);
    y += 100;
  }

  measure() {
    const measurement = ctx.measureText(this.name);
    const height =
      Math.abs(measurement.actualBoundingBoxAscent) +
      Math.abs(measurement.actualBoundingBoxDescent);
    const width = measurement.width;
    const radius = Math.max(width, height) + UseCase.PADDING;
    this.dimensions = {
      radius,
      textWidth: width,
      textHeight: height,
    };
  }

  draw() {
    if (this.focused) {
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
    } else {
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
    }
    if (this.dimensions == null) {
      this.measure();
    }
    ctx.beginPath();
    ctx.ellipse(
      this.pos.x,
      this.pos.y,
      this.dimensions.radius,
      this.dimensions.radius,
      0,
      0,
      2 * Math.PI,
    );
    ctx.stroke();
    ctx.fillText(
      this.name,
      this.pos.x - this.dimensions.textWidth / 2,
      this.pos.y + this.dimensions.textHeight / 2,
    );
  }
}
