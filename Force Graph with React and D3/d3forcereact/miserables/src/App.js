import './styles.css'
//import * as d3 from 'd3';
import data from './data/data.json';
import { useState, useEffect } from 'react';
import { ForceGraph } from './components/ForceGraph';

const App = () => {
  const [charge, setCharge] = useState(-3);
  const [collission, setCollission] = useState(5);

  return (
    <div className='App'>
      <h1>Les Miserables</h1>
      <h2 style={{color: 'grey'}} >Main Characters</h2>
      <hr />
      <div className='graph-parameters'>
        <p>Current charge: {charge}</p>
        <input
          type="range"
          min="-300"
          max="300"
          step="10"
          value={charge}
          onChange={e => setCharge(e.target.value)}
        />
        <p>Curent collission: {collission}</p>
        <input
          type="range"
          min="5"
          max="1000"
          step="5"
          value={collission}
          onChange={e => setCollission(e.target.value)}
        />
      </div>
      <hr />
      <svg width="800" height="600">
        <ForceGraph nodes={data.nodes} links={data.links} charge={charge} collission={collission} />
      </svg>
    </div>
  );
}

export default App;
