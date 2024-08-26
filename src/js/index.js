const adjList = {
  1: [],
  2: [1],
  3: [1, 5],
  4: [5],
  5: [2],
  6: [4, 2],
};

const roots = [3, 6];

/**
 * @param {number} vertex
 * @param {{ [key: number]: number[] }} adjList
 * @param {Map<number, boolean>} visitRecord
 * @param {number[]} ordering
 */
function topologicalSortAux(vertex, adjList, visitRecord, ordering) {
  visitRecord[vertex] = true;
  for (const neighbor of adjList[vertex]) {
    if (!visitRecord[neighbor]) {
      topologicalSortAux(neighbor, adjList, visitRecord, ordering);
    }
  }
  ordering.push(vertex);
}

/**
 * @param {{ [key: number]: number[] }} adjList
 * @param {number[]} roots
 * @returns A list containing all the vertices of `ajdList` in reverse
 *   topological ordering .i.e. The last element of the list is the first
 *   element of the topological ordering
 */
function topologicalSort(adjList, roots) {
  /** @type {Map<number, boolean>} */
  const visitRecord = new Map();

  /** @type {number[]} */
  const ordering = [];

  for (const vertex of roots) {
    topologicalSortAux(vertex, adjList, visitRecord, ordering);
  }
  return ordering;
}

/**
 * @param {{ [key: number]: number[] }} adjList
 * @param {number[]} roots
 */
function assignLayersLongestPath(adjList, roots) {
  const topOrder = topologicalSort(adjList, roots);
  /** @type {Map<number, number>} */
  const distanceTo = new Map();
  for (const root of roots) {
    distanceTo.set(root, 0);
  }

  while (topOrder.length > 0) {
    const current = topOrder.pop();
    for (const neighbor of adjList[current]) {
      const currentDist = distanceTo.get(current);
      const distanceToNeighbor = distanceTo.get(neighbor);
      if (distanceToNeighbor == null) {
        distanceTo.set(neighbor, currentDist + 1);
      } else if (distanceToNeighbor < distanceTo.get(current) + 1) {
        distanceTo.set(neighbor, currentDist + 1);
      }
    }
  }
  return distanceTo;
}

console.log(assignLayersLongestPath(adjList, roots));
