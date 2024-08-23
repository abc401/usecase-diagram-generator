import { ctx } from "./canvas.js";
import { Vec2 } from "./vec2.js";
let x = 200;
let y = 200;

export class UseCase {
  static PADDING = 20;
  static PADDING_THRESHOLD = 5;

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

  forceAppliedOnSelf = Vec2.Zero();

  /** @type {UseCase[]} */
  includes = [];

  /** @type {UseCase[]} */
  extends = [];

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

    useCases.push(this);
  }

  /** @param {UseCase[]} useCases */
  setIncludes(...useCases) {
    for (const useCase of useCases) {
      if (useCase === this || useCase.doesInclude(this)) {
        throw Error();
      }
    }
    this.includes = useCases;
  }

  /** @param {UseCase} useCase */
  doesInclude(useCase) {
    for (const includedUseCase of this.includes) {
      if (includedUseCase === useCase) {
        return true;
      }
    }
    return false;
  }

  /** @param {Vec2} force */
  applyForceOnSelf(force) {
    this.forceAppliedOnSelf = this.forceAppliedOnSelf.add(force.filterNaN());
  }

  finalizeForceApplied() {
    this.pos = this.pos.add(this.forceAppliedOnSelf);
    this.forceAppliedOnSelf = Vec2.Zero();
  }

  draw() {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    for (const includedUseCase of this.includes) {
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(includedUseCase.pos.x, includedUseCase.pos.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        includedUseCase.pos.x,
        includedUseCase.pos.y,
        5,
        5,
        0,
        0,
        2 * Math.PI,
      );
      ctx.fill();
    }

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

/** @type {UseCase[]} */
export const useCases = [];
