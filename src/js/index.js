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

console.log(topologicalSort(adjList, roots));
