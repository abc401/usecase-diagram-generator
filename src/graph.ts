import { ctx } from "./canvas";
import { Vec2 } from "./math";

export const UNIT_X = 200;
export const UNIT_Y = 150;
export const VERT_PADDING = 20;
export const GRAPH_OFFSET_X = 300;
export const GRAPH_OFFSET_Y = 85;
export const VERTEX_FONT = "bold 20px monospace";

export type VertexID = number;
export type AdjList = Map<VertexID, VertexID[]>;
export type Layer = Array<Vertex | undefined>;

export interface LayeredVertIndices {
  layerIdx: number;
  vertexIdx: number;
}

export interface VertexDimensions {
  textSize: Vec2;
  radius: number;
}

function drawArrow(start: Vec2, end: Vec2) {
  const delta = end.sub(start);
  const arrowLength = delta.mag();
  const norm = delta.norm().scalarMul(10);
  const leftWingStart = end.sub(norm.rotate(Math.PI / 6, end));
  const rightWingStart = end.sub(norm.rotate(-Math.PI / 6, end));

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(leftWingStart.x, leftWingStart.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineTo(rightWingStart.x, rightWingStart.y);
  ctx.closePath();
  ctx.fill();
  // ctx.lineTo(end.x, end.y);
}

function drawLine(start: Vec2, end: Vec2) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

export class Vertex {
  private dim: VertexDimensions;
  neighbors: Vertex[] = [];
  reverseNeighbors: Vertex[] = [];

  constructor(
    readonly id: VertexID,
    private text: string,
    public indices: LayeredVertIndices,
  ) {
    ctx.font = VERTEX_FONT;
    const measurement = ctx.measureText(text);
    const textSize = new Vec2(
      Math.abs(measurement.actualBoundingBoxLeft) +
        Math.abs(measurement.actualBoundingBoxRight),

      Math.abs(measurement.actualBoundingBoxAscent) +
        Math.abs(measurement.actualBoundingBoxDescent),
    );

    this.dim = {
      radius: Math.max(textSize.x, textSize.y) + VERT_PADDING,
      textSize,
    };
  }

  getPos() {
    return new Vec2(
      this.indices.layerIdx * UNIT_X + GRAPH_OFFSET_X,
      this.indices.vertexIdx * UNIT_Y + GRAPH_OFFSET_Y,
    );
  }

  getDim(): VertexDimensions {
    return {
      radius: this.dim.radius,
      textSize: this.dim.textSize.clone(),
    };
  }

  getRadius() {
    return this.dim.radius;
  }
  getTextSize() {
    return this.dim.textSize.clone();
  }
  drawDebug() {
    const pos = this.getPos();
    const dim = this.dim;

    ctx.font = VERTEX_FONT;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, dim.radius, dim.radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(
      this.text,
      pos.x - this.dim.textSize.x / 2,
      pos.y + dim.textSize.y / 2,
    );
  }

  draw() {
    if (this.id <= 0) {
      return;
    }

    const pos = this.getPos();
    const dim = this.dim;

    ctx.font = VERTEX_FONT;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, dim.radius, dim.radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(
      this.text,
      pos.x - this.dim.textSize.x / 2,
      pos.y + dim.textSize.y / 2,
    );
  }

  drawEdgesDebug() {
    const dim = this.dim;
    const pos = this.getPos();

    for (const neighbor of this.neighbors) {
      const neighborPos = neighbor.getPos();
      const neighborDim = neighbor.getDim();

      const edgeDirection = neighborPos.sub(pos).norm();
      const p1 = pos.add(edgeDirection.scalarMul(dim.radius));
      const p2 = neighborPos.sub(edgeDirection.scalarMul(neighborDim.radius));

      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";

      drawArrow(p1, p2);
    }
  }

  drawEdges() {
    const dim = this.dim;
    const pos = this.getPos();

    for (const neighbor of this.neighbors) {
      const neighborPos = neighbor.getPos();
      const neighborDim = neighbor.getDim();

      const edgeDirection = neighborPos.sub(pos).norm();

      let p1 = Vec2.Zero();
      let p2 = Vec2.Zero();
      if (this.id <= 0) {
        p1 = pos.clone();
      } else {
        p1 = pos.add(edgeDirection.scalarMul(dim.radius));
      }
      if (neighbor.id <= 0) {
        p2 = neighborPos.clone();
      } else {
        p2 = neighborPos.sub(edgeDirection.scalarMul(neighborDim.radius));
      }

      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";

      if (neighbor.id <= 0) {
        drawLine(p1, p2);
      } else {
        drawArrow(p1, p2);
      }
    }
  }
}
