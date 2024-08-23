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

  static Zero() {
    return new Vec2(0, 0);
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  neg() {
    return new Vec2(-this.x, -this.y);
  }

  /** @param {Vec2} that */
  sub(that) {
    return new Vec2(this.x - that.x, this.y - that.y);
  }

  /** @param {Vec2} that */
  add(that) {
    return new Vec2(this.x + that.x, this.y + that.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  norm() {
    const mag = this.mag();
    if (mag === 0) {
      console.log("magnitude is zero");
    }
    return new Vec2(this.x / mag, this.y / mag);
  }

  filterNaN() {
    return new Vec2(
      Number.isNaN(this.x) ? 0 : this.x,
      Number.isNaN(this.y) ? 0 : this.y,
    );
  }

  /** @param {number} scalar */
  scalarAdd(scalar) {
    return new Vec2(this.x + scalar, this.y + scalar);
  }

  /** @param {number} scalar */
  scalarMul(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  /** @param {number} scalar */
  scalarDiv(scalar) {
    return new Vec2(this.x / scalar, this.y / scalar);
  }
}
