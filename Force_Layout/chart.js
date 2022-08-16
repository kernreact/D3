async function drawForceLayoutChart() {
  // 1. Acces Data
  const dataset = await d3.json('./data.json');

  node_data = [ ...dataset.nodes];
 
  edge_data = [ ...dataset.links];
  console.log(edge_data)

  
  //Width and height
  const w = 1400;
  const  h = 800;

  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  const force = d3.forceSimulation(node_data)
    .force("charge", d3.forceManyBody().strength(-125))
    .force("link", d3.forceLink(edge_data).distance(d => d.index ))
    .force("center", d3.forceCenter().x(w/2).y(h/2))
    .force("collide", d3.forceCollide().radius(10));

  //Create SVG element
  const svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  // create edges as lines
  let edge = null;
  edge = svg.selectAll(".edge")
    .data(edge_data).enter()
    .append("line")
    .classed("edge", true)
    .style("stroke", "#ccc")
    .style("stroke-width", d => d.value/2);

  // create a circle for each node
  let node = null;
  node = svg.selectAll(".node")
    .data(node_data).enter()
    .append("circle")
    .classed("node", true)
    .attr("r", 10)
    .style("fill", d => colors(d.group))
    .call(drag(force))

  // create a label for each node
  let label = null;
  label = svg.selectAll(".label")
    .data(node_data).enter()
    .append("text")
    .attr("stroke", d => colors(d.group))
    .style("opacity", 0.6)
    .attr("font-size", "0.8em")
    .text(d => d.name)
    .style("transform", "translate(10px, -10px)");
    

 
  // every time the simulation "ticks", this will be called
  force.on("tick", () => {
    edge.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x)
          .attr("cy", d => d.y);
    
    label.attr("x", d => d.x)
          .attr("y", d => d.y);
  });

  function drag(simulation) {    
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
 
};

drawForceLayoutChart()


