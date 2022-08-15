import './styles.css';
import * as d3 from 'd3';
import { useEffect, useState, useMemo } from 'react';

const ForceGraph = ({ nodes, charge, collission }) =>  {
  const [animatedNodes, setAnimatedNodes] = useState([]);

  // re-create animation every time nodes change
  useEffect(() => {
    const simulation = d3
      .forceSimulation()
      // adding a centering force
      .force("x", d3.forceX(400))
      .force("y", d3.forceY(300))
      .force("charge", d3.forceManyBody().strength(charge))
      .force("collission", d3.forceCollide(collission));

    // update state on every frame
    simulation.on("tick", () => {
      setAnimatedNodes([...simulation.nodes()]);
    })

    // copy nodes into simulation
    simulation.nodes([...nodes]);

    // slow down with a smal alpha
    simulation.alpha(0.1).restart();

    // stop simulation on unmount
    return () => simulation.stop();
  }, [nodes, charge, collission]);

  return (
    <g>
      {animatedNodes.map((node) => (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.r}
          key={node.id}
          stroke="black"
          fill="transparent"
        />
      ))}
    </g>
  );
}

const App = () => {
  const [charge, setCharge] = useState(-3);
  const [collission, setCollission] = useState(5);

  // create nodes with unique ids
  // radius 5px
  const nodes = useMemo(
    () => 
      d3.range(50).map(node => {
        return { id: node, r: 5 };
    }),
    []
  );
  

  return (
    <div className='App'>
      <h1>React & D3 force graph</h1>
      <p>Current charge: {charge}</p>
      <input
        type="range"
        min="-30"
        max="30"
        step="1"
        value={charge}
        onChange={e => setCharge(e.target.value)}
      />
      <p>Curent collission: {collission}</p>
      <input
        type="range"
        min="5"
        max="15"
        step="1"
        value={collission}
        onChange={e => setCollission(e.target.value)}
      />
      <svg width="800" height="600">
        <ForceGraph nodes={nodes} charge={charge} collission={collission}/>
      </svg>
    </div>
  )
}

export default App;
