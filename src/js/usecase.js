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
   * @type {{
   *   radius: number;
   *   textWidth: number;
   *   textHeight: number;
   * }}
   */
  dimensions;

  /** @type {UseCase[]} */
  includes = [];

  /** @type {UseCase[]} */
  extends = [];

  forceAppliedOnSelf = Vec2.Zero();

  focused = false;

  /** @param {string} name */
  constructor(name) {
    this.name = name;
    this.pos = new Vec2(x, y);
    y += 100;

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

  /** @param {UseCase[]} useCases */
  applyForceOn(useCases) {
    for (const useCase of useCases) {
      if (useCase === this) {
        continue;
      }

      const delta = useCase.pos.sub(this.pos);

      const desiredDistance = this.desiredMinDistanceFor(useCase);
      if (delta.mag() < desiredDistance) {
        useCase.forceAppliedOnSelf = useCase.forceAppliedOnSelf.add(
          delta.norm().scalarMul(desiredDistance - delta.mag()),
        );
      }
    }
  }

  /** @param {UseCase} useCase */
  desiredMinDistanceFor(useCase) {
    return UseCase.PADDING + this.dimensions.radius + useCase.dimensions.radius;
  }

  draw() {
    if (this.focused) {
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
    } else {
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
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
