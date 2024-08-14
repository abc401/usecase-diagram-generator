export class Vec2 {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /** @param {Vec2} that */
  sub(that) {
    return new Vec2(this.x - that.x, this.y - that.y);
  }

  add(that) {
    return new Vec2(this.x + that.x, this.y + that.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  norm() {
    const mag = this.mag();
    return new Vec2(this.x / mag, this.y / mag);
  }

  /** @param {number} scalar */
  scalarAdd(scalar) {
    return new Vec2(this.x + scalar, this.y + scalar);
  }

  /** @param {number} scalar */
  scalarMul(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }
}
