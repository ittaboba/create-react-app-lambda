import React, {useEffect, useRef} from 'react';
import Graph from 'graphology';

import './App.css';
import { PixiGraph, TextType } from 'pixi-graph';

const colors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

const resources = [
  { name: 'HelveticaRegular', url: 'https://gist.githubusercontent.com/zakjan/b61c0a26d297edf0c09a066712680f37/raw/8cdda3c21ba3668c3dd022efac6d7f740c9f1e18/HelveticaRegular.fnt' },
];

const graph = new Graph()

const style = {
  node: {
    size: 15,
    color: (node) => colors[(node.group || 0) % colors.length],
    border: {
      width: 2,
      color: '#ffffff',
    },
    icon: {
      content: 'person',
      fontFamily: 'Material Icons',
      fontSize: 20,
      color: '#ffffff',
    },
    label: {
      content: (node) => node.id,
      type: TextType.BITMAP_TEXT,
      fontFamily: 'HelveticaRegular',
      fontSize: 12,
      color: '#333333',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      padding: 4,
    },
  },
  edge: {
    width: (link) => Math.log((link.value || 0) + 1) + 1,
    color: '#cccccc',
  },
};
const hoverStyle = {
  node: {
    border: {
      color: '#000000',
    },
    label: {
      backgroundColor: 'rgba(238, 238, 238, 1)',
    },
  },
  edge: {
    color: '#999999',
  },
};

function App() {
  const graphContainer = useRef(null);
  const pixiGraph = useRef(null);

  useEffect(() => {
    if(pixiGraph.current) return
    pixiGraph.current = new PixiGraph({
      container: graphContainer.current,
      graph,
      style,
      hoverStyle,
      resources
    })

    pixiGraph.current.on('nodeClick', (event, nodeKey) => console.log('nodeClick', event, nodeKey))
  })

  useEffect(() => {
    let n = []
    let l = []
    let ids = []
    let pos = {}

    for(let i = 0; i < 10000; i++) {
      const id = i.toString()
      ids.push(id)

      n.push({"id": id, "group": 1})

      if(i > 0) {
        l.push({"source": id, "target": ids[Math.floor((Math.random() * i) + 1)], "value": 1})
      }

      pos[id] = {"x":Math.floor((Math.random() * 100000) + 1),"y":Math.floor((Math.random() * 100000) + 1)}
    }

    const { nodes, links } = {
      "nodes": n,
      "links": l
    }

    // const { nodes, links } = await (await fetch('socfb-Caltech36.json')).json();
    nodes.forEach(node => {
      graph.addNode(node.id, node);
    });
    links.forEach(link => {
      graph.addEdge(link.source, link.target, link);
    });

    // layout
    graph.forEachNode(node => {
      graph.setNodeAttribute(node, 'x', Math.random());
      graph.setNodeAttribute(node, 'y', Math.random());
    });
    // forceAtlas2.assign(graph, { iterations: 300, settings: { ...forceAtlas2.inferSettings(graph), scalingRatio: 80 }});
    const positions = pos
    graph.forEachNode(node => {
      const position = positions[node];
      graph.setNodeAttribute(node, 'x', position.x);
      graph.setNodeAttribute(node, 'y', position.y);
    });
  }, [])


  const addNode = () => {
    const id = "test-3";
    const x = 100;
    const y = 300;
    const node = { id, x, y };

    graph.addNode(node.id, node);
  };
  
  const addEdge = () => {
    graph.addEdge("test-1", "test-3", {"source": "test-1", "target": "test-3", "value": 1});
  }

  return (
    <div>
      <div style={{width: "100vw", height: "100vh"}} ref={graphContainer}></div> 
      <button onClick={addNode}>Add node</button>
      <button onClick={addEdge}>Add edge</button>
    </div>
       
  );
}

export default App;
