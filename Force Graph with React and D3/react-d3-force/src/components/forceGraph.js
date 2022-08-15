import { useEffect, useRef } from 'react';
import { runForceGraph } from './forceGraphGenerator';
import styles from './forceGraph.module.css';

export const ForceGraph = ( {linksData, nodesData, nodeHoverTooltip }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(containerRef.current, linksData, nodesData, nodeHoverTooltip);
      destroyFn = destroy;
    }

    return destroyFn;
  }, []);

  return <div ref={containerRef} className={StyleSheet.container} />
}