import { Vertex, VertexID, AdjList, Layer } from "./graph";
import { ctx, canvas } from "./canvas";

function reverseTopSortAux(
  vertex: VertexID,
  adjList: AdjList,
  visitRecord: Map<VertexID, boolean>,
  ordering: VertexID[],
) {
  visitRecord.set(vertex, true);
  const neighbors = adjList.get(vertex);
  if (neighbors == null) {
    throw Error();
  }
  for (const neighbor of neighbors) {
    if (visitRecord.get(neighbor) !== true) {
      reverseTopSortAux(neighbor, adjList, visitRecord, ordering);
    }
  }
  ordering.push(vertex);
}

function reverseTopSort(adjList: AdjList, roots: VertexID[]) {
  const visitRecord = new Map<VertexID, boolean>();

  const ordering = new Array<VertexID>();

  for (const vertex of roots) {
    reverseTopSortAux(vertex, adjList, visitRecord, ordering);
  }
  return ordering;
}

function assignLayersLongestPath(adjList: AdjList, roots: VertexID[]) {
  const topOrder = reverseTopSort(adjList, roots);
  const layerAssignment = new Map<VertexID, number>();
  for (const root of roots) {
    layerAssignment.set(root, 0);
  }

  while (topOrder.length > 0) {
    const current = topOrder.pop();
    if (current == null) {
      throw Error();
    }

    const neighbors = adjList.get(current);
    if (neighbors == null) {
      throw Error();
    }
    for (const neighbor of neighbors) {
      const currentDist = layerAssignment.get(current);
      if (currentDist == null) {
        throw Error();
      }

      const distanceToNeighbor = layerAssignment.get(neighbor);
      if (distanceToNeighbor == null) {
        layerAssignment.set(neighbor, currentDist + 1);
      } else if (distanceToNeighbor < currentDist + 1) {
        layerAssignment.set(neighbor, currentDist + 1);
      }
    }
  }
  return layerAssignment;
}

function createLayers(
  layerAssignments: Map<VertexID, number>,
  adjList: AdjList,
) {
  const layers: Vertex[][] = [];
  const vertices = new Map<VertexID, Vertex>();

  for (const [vertexID, layerIdx] of layerAssignments) {
    if (layers[layerIdx] == null) {
      layers[layerIdx] = [];
    }
    const currLayer = layers[layerIdx];
    console.log("vertexID: ", vertexID);
    const vertex = new Vertex(vertexID, vertexID.toString(), {
      layerIdx,
      vertexIdx: currLayer.length,
    });
    vertices.set(vertexID, vertex);
    currLayer.push(vertex);
  }

  let currDummyVertexID = -1;
  for (
    let currentLayerIdx = 0;
    currentLayerIdx < layers.length;
    currentLayerIdx++
  ) {
    const layer = layers[currentLayerIdx];
    for (const vertex of layer) {
      const newNeighbors: Vertex[] = [];
      const neighborIDs = adjList.get(vertex.id);

      if (neighborIDs == null) {
        throw Error();
      }
      for (const neighborID of neighborIDs) {
        const neighborVertex = vertices.get(neighborID);
        if (neighborVertex == null) {
          throw Error();
        }

        const desiredNeighborLayerIdx = currentLayerIdx + 1;
        const desiredNeighborLayer = layers[desiredNeighborLayerIdx];

        if (neighborVertex.indices.layerIdx > desiredNeighborLayerIdx) {
          const dummyVertex = new Vertex(
            currDummyVertexID,
            currDummyVertexID.toString(),
            {
              layerIdx: desiredNeighborLayerIdx,
              vertexIdx: desiredNeighborLayer.length,
            },
          );
          adjList.set(dummyVertex.id, [neighborVertex.id]);
          dummyVertex.neighbors.push(neighborVertex);

          newNeighbors.push(dummyVertex);
          desiredNeighborLayer.push(dummyVertex);
          // layerAssignments.set(currDummyVertexID, currentLayerIdx + 1);
          currDummyVertexID -= 1;
        } else if (
          neighborVertex.indices.layerIdx === desiredNeighborLayerIdx
        ) {
          newNeighbors.push(neighborVertex);
        } else {
          console.log("adjList: ", adjList);
          console.log("layers: ", layers);
          throw Error();
        }
      }
      vertex.neighbors = newNeighbors;
      // adjList.set(vertex, newNeighbors);
    }
  }

  for (const layer of layers) {
    for (const vertex of layer) {
      for (const neighbor of vertex.neighbors) {
        neighbor.reverseNeighbors.push(vertex);
      }
    }
  }
  return layers;
}

function baryCenterHeuristic(vertex: Vertex, layer: Layer) {
  let sumOfNeighborIdx = 0;
  let nNeighbors = vertex.neighbors.length + vertex.reverseNeighbors.length;

  for (const neighbor of vertex.neighbors) {
    sumOfNeighborIdx += neighbor.indices.vertexIdx;
  }
  for (const neighbor of vertex.reverseNeighbors) {
    sumOfNeighborIdx += neighbor.indices.vertexIdx;
  }

  if (nNeighbors == 0) {
    return;
  }

  const avgVertexIdx = Math.round(sumOfNeighborIdx / nNeighbors);
  const tmp = layer[avgVertexIdx];
  if (tmp == null) {
    layer[vertex.indices.vertexIdx] = undefined;
    layer[avgVertexIdx] = vertex;
    vertex.indices.vertexIdx = avgVertexIdx;
  } else {
    layer[avgVertexIdx] = layer[vertex.indices.vertexIdx];
    layer[vertex.indices.vertexIdx] = tmp;

    tmp.indices.vertexIdx = vertex.indices.vertexIdx;
    vertex.indices.vertexIdx = avgVertexIdx;
  }
}

function sugiyamaGraphLayout(
  adjList: AdjList,
  roots: VertexID[],
): [Layer[], Map<VertexID, number>] {
  const layerAssignments = assignLayersLongestPath(adjList, roots);

  console.log("layer Assignments: ", layerAssignments);
  const layers = createLayers(layerAssignments, adjList);
  return [layers, layerAssignments];
}

function drawGraph(layers: Layer[]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const currLayer of layers) {
    for (const vertex of currLayer) {
      if (vertex == null) {
        continue;
      }
      vertex.draw();
    }
  }

  for (const currLayer of layers) {
    for (const vertex of currLayer) {
      if (vertex == null) {
        continue;
      }
      vertex.drawEdges();
    }
  }
}

function main() {
  const adjList: AdjList = new Map([
    [1, []],
    [2, [1]],
    [3, [1, 5]],
    [4, [5]],
    [5, [2]],
    [6, [4, 2]],
  ]);

  const roots: VertexID[] = [3, 6];
  const [layers, layerAssignment] = sugiyamaGraphLayout(adjList, roots);

  document.addEventListener("keypress", () => {
    drawGraph(layers);
    for (const layer of layers) {
      for (const vertex of layer) {
        if (vertex == null) {
          continue;
        }
        console.log("barycenter vertex: ", vertex.id);
        baryCenterHeuristic(vertex, layer);
      }
    }
  });
  console.log("layers: ", layers);
  console.log("layer Assignment: ", layerAssignment);
  console.log("adjList: ", adjList);
}

main();
