// Graph Nodes and Edges Definition
const nodes = [
  { id: 'Taco Town', type: 'restaurant', x: 100, y: 80 },
  { id: 'Curry Corner', type: 'restaurant', x: 100, y: 400 },
  { id: 'Pasta Paradise', type: 'restaurant', x: 700, y: 80 },
  { id: 'Sandwich Shop', type: 'restaurant', x: 700, y: 400 },
  { id: 'Customer X', type: 'customer', x: 300, y: 100 },
  { id: 'Customer Y', type: 'customer', x: 600, y: 150 },
  { id: 'Customer Z', type: 'customer', x: 350, y: 300 },
  { id: 'Customer W', type: 'customer', x: 600, y: 350 },
  { id: 'Customer V', type: 'customer', x: 200, y: 250 },
  { id: 'i1', type: 'intersection', x: 350, y: 180 },
  { id: 'i2', type: 'intersection', x: 250, y: 200 },
  { id: 'i3', type: 'intersection', x: 450, y: 150 },
  { id: 'i4', type: 'intersection', x: 450, y: 300 },
  { id: 'i5', type: 'intersection', x: 500, y: 380 }
];

const edges = [
  ['Taco Town', 'Customer X', 60],
  ['Customer X', 'i1', 50],
  ['i1', 'i3', 50],
  ['i3', 'Pasta Paradise', 80],
  ['Customer X', 'i2', 80],
  ['i2', 'Customer V', 50],
  ['i2', 'Curry Corner', 90],
  ['i1', 'i4', 60],
  ['i4', 'Customer Z', 40],
  ['Customer Z', 'Customer V', 40],
  ['i4', 'i5', 50],
  ['i5', 'Customer W', 30],
  ['Customer W', 'Sandwich Shop', 50],
  ['i3', 'Customer Y', 60],
  ['Customer Y', 'Pasta Paradise', 50]
];

let canvas = document.getElementById('graphCanvas');
let ctx = canvas.getContext('2d');

function drawGraph(path=[]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(([from, to, dist]) => {
    const fromNode = nodes.find(n => n.id === from);
    const toNode = nodes.find(n => n.id === to);

    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = path.includes(`${from}-${to}`) || path.includes(`${to}-${from}`) ? '#ff5722' : '#bbb';
    ctx.lineWidth = path.includes(`${from}-${to}`) || path.includes(`${to}-${from}`) ? 3 : 1;
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = node.type === 'restaurant' ? '#ff5722' : node.type === 'customer' ? '#00bcd4' : '#607d8b';
    ctx.fill();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#000';
    ctx.fillText(node.id, node.x + 12, node.y + 4);
  });
}

function optimizeRoute() {
  const startId = document.getElementById('start').value;
  const endId = document.getElementById('end').value;

  const { distance, path, edgesUsed } = dijkstra(startId, endId);

  document.getElementById('distance').innerText = `Total Distance: ${distance} units`;
  document.getElementById('time').innerText = `Estimated Time: ${Math.round(distance / 10)} min`;
  document.getElementById('path').innerText = `Route Path: ${path.join(' → ')}`;
  drawGraph(edgesUsed);
}

function resetGraph() {
  document.getElementById('distance').innerText = 'Total Distance: -';
  document.getElementById('time').innerText = 'Estimated Time: -';
  document.getElementById('path').innerText = 'Route Path: -';
  drawGraph();
}

function dijkstra(startId, endId) {
  const dist = {}, prev = {}, visited = new Set();
  const pq = new Set(nodes.map(n => n.id));

  nodes.forEach(n => dist[n.id] = Infinity);
  dist[startId] = 0;

  while (pq.size > 0) {
    let current = [...pq].reduce((a, b) => dist[a] < dist[b] ? a : b);
    pq.delete(current);
    visited.add(current);

    edges.filter(e => e[0] === current || e[1] === current).forEach(([u, v, w]) => {
      const neighbor = u === current ? v : u;
      if (!visited.has(neighbor)) {
        const alt = dist[current] + w;
        if (alt < dist[neighbor]) {
          dist[neighbor] = alt;
          prev[neighbor] = current;
        }
      }
    });
  }

  const path = [];
  let u = endId;
  while (u !== undefined) {
    path.unshift(u);
    u = prev[u];
  }

  const edgesUsed = [];
  for (let i = 0; i < path.length - 1; i++) {
    edgesUsed.push(`${path[i]}-${path[i + 1]}`);
  }

  return { distance: dist[endId], path, edgesUsed };
}

function populateDropdowns() {
  const dropdowns = [document.getElementById('start'), document.getElementById('end')];
  dropdowns.forEach(select => {
    nodes.forEach(n => {
      const opt = document.createElement('option');
      opt.value = n.id;
      opt.innerText = n.id;
      select.appendChild(opt.cloneNode(true));
    });
  });
}

function displayStats() {
  const counts = {
    restaurant: nodes.filter(n => n.type === 'restaurant').length,
    customer: nodes.filter(n => n.type === 'customer').length,
    intersection: nodes.filter(n => n.type === 'intersection').length,
    edges: edges.length
  };

  document.getElementById('stats').innerText = `
    Restaurants: ${counts.restaurant},
    Customers: ${counts.customer},
    Intersections: ${counts.intersection},
    Connections: ${counts.edges}
  `;
}

populateDropdowns();
displayStats();
drawGraph();
