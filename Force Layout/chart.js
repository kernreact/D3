
async function drawForceLayoutChart() {
  // 1. Acces Data
  const dataset = await d3.json('./data.json');
  
  //Width and height
  const w = 500;
  const  h = 300;

  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  const force = d3.forceSimulation(dataset.nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(dataset.links))
    .force("center", d3.forceCenter().x(w/2).y(h/2));
   
  //Create SVG element
  const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  // create edges as lines
  const edges = svg.selectAll("line")
    .data(dataset.links)
    .enter()
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);

  // create a circle for each node
  const nodes = svg.selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr("r", 10)
    .style("fill", (d, i) => { return colors(i)
      })
    .call(d3.drag(force)
      .on("start", dragStarted)
      .on("drag", dragging)
      .on("end", dragEnded));

 
  // every time the simulation "ticks", this will be called
  force.on("tick", () => {
    edges.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

    nodes.attr("cx", d => d.x)
          .attr("cy", d => d.y);
  });
 
};

drawForceLayoutChart()

// define drag event functions
const drag = (force) => {
  const dragStarted = (e) => {
    if (!e.active) force.alphaTarget(0.3).restart();
    e.fx = e.x;
    e.fy = d.y;
    }
    
  const dragging = (e) => {
    e.fx = e.x;
    e.fy = e.y;
  }
    
  const dragEnded = (e) => {
    if (!e.active) force.alphaTarget(0);
    e.fx = null;
    e.fy = null;
  }

  return {
    dragStarted,
    dragging,
    dragEnded
  }
};
