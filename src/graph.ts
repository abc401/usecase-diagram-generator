import { ctx } from "./canvas";
import { Vec2 } from "./math";

export const UNIT = 200;
export const VERT_PADDING = 20;
export const GRAPH_OFFSET = 100;

export type VertexID = number;
export type AdjList = Map<VertexID, VertexID[]>;

export interface LayeredVertIndices {
  layerIdx: number;
  vertexIdx: number;
}

export interface VertexDimensions {
  textSize: Vec2;
  radius: number;
}

export class Vertex {
  private dim: VertexDimensions;
  neighbors: Vertex[] = [];

  constructor(
    readonly id: VertexID,
    private text: string,
    public indices: LayeredVertIndices,
  ) {
    ctx.font = "bold 48px monospace";
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
      this.indices.layerIdx * UNIT + GRAPH_OFFSET,
      this.indices.vertexIdx * UNIT + GRAPH_OFFSET,
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

  draw() {
    const pos = this.getPos();
    const dim = this.dim;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, dim.radius, dim.radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(
      this.text,
      pos.x - this.dim.textSize.x / 2,
      pos.y + dim.textSize.y / 2,
    );
  }

  drawEdges() {
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

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
}
