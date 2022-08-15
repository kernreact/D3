import * as d3 from 'd3';
import { useState, useEffect } from 'react';

export const ForceGraph = ( {nodes, links, charge, collission} ) => {
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);


  useEffect(() => {
   
    const simulation = d3
    .forceSimulation()
    //.force("link", d3.forceLink(links))
    // adding a centering force
    .force("x", d3.forceX(400))
    .force("y", d3.forceY(300))
    .force("charge", d3.forceManyBody().strength(charge))
    .force("collission", d3.forceCollide(collission));
    
   
    simulation.on("tick", () => {
      setAnimatedNodes([...simulation.nodes()]);
      //setAnimatedLinks([...simulation.links()])
    })

    simulation
      .nodes([...nodes])
      .force("link", d3.forceLink(links));

    const node = d3.selectAll("circle")
  
    node.call(drag(simulation));

    function drag(simulation) {
      function dragstarted(event) {
        console.log("event.subject", event);
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        console.log("event.subject", event);
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        console.log("event.subject", event);
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    return () => simulation.stop();
  },[nodes, links, charge, collission])

  const colors = d3.scaleOrdinal(d3.schemeCategory10);  
  
  return (
      <g>
        {animatedNodes.map((node) => (
          <circle
            cx={node.x}
            cy={node.y}
            r="15"
            key={node.name}
            stroke="black"
            fill={colors(node.group)}
          />
        ))}
        {links.map((link, i) => (
          <line
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            key={i}
            stroke="grey"
            strokeWidth={link.value}
            opacity="0.3"
          />
        ))}
      </g>
  )
};