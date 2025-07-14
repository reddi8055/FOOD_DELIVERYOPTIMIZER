import React, { useState, useEffect } from 'react';
import { Node, DijkstraResult } from './types';
import { DijkstraAlgorithm } from './utils/dijkstra';
import { deliveryScenarios } from './data/scenarios';
import DeliveryMap from './components/DeliveryMap';
import RouteInfo from './components/RouteInfo';
import Controls from './components/Controls';
import { Zap } from 'lucide-react';

function App() {
  const [selectedScenario, setSelectedScenario] = useState(deliveryScenarios[0].id);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [optimizedPath, setOptimizedPath] = useState<string[]>([]);
  const [dijkstraResult, setDijkstraResult] = useState<DijkstraResult | null>(null);

  const currentScenario = deliveryScenarios.find(s => s.id === selectedScenario)!;
  const allNodes = [
    ...currentScenario.restaurants,
    ...currentScenario.customers,
    ...currentScenario.intersections
  ];

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodes(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      }
      if (prev.length >= 2) {
        return [nodeId];
      }
      return [...prev, nodeId];
    });
  };

  const handleOptimize = () => {
    if (selectedNodes.length === 2) {
      const dijkstra = new DijkstraAlgorithm(allNodes, currentScenario.edges);
      const result = dijkstra.findShortestPath(selectedNodes[0], selectedNodes[1]);
      setDijkstraResult(result);
      setOptimizedPath(result.path);
    }
  };

  const handleReset = () => {
    setSelectedNodes([]);
    setOptimizedPath([]);
    setDijkstraResult(null);
  };

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    handleReset();
  };

  useEffect(() => {
    if (selectedNodes.length === 2) {
      handleOptimize();
    } else {
      setOptimizedPath([]);
      setDijkstraResult(null);
    }
  }, [selectedNodes, selectedScenario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Zap className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Food Delivery Optimizer
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Using Dijkstra's algorithm to find the shortest delivery routes between restaurants and customers
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Delivery Network - {currentScenario.name}
              </h2>
              <DeliveryMap
                nodes={allNodes}
                edges={currentScenario.edges}
                selectedNodes={selectedNodes}
                optimizedPath={optimizedPath}
                onNodeClick={handleNodeClick}
              />
            </div>

            <RouteInfo
              result={dijkstraResult}
              nodes={allNodes}
              selectedNodes={selectedNodes}
            />
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            <Controls
              scenarios={deliveryScenarios}
              selectedScenario={selectedScenario}
              onScenarioChange={handleScenarioChange}
              onReset={handleReset}
              onOptimize={handleOptimize}
              selectedNodes={selectedNodes}
            />

            {/* Algorithm Info */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Algorithm Details
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Dijkstra's Algorithm:</strong> Finds the shortest path between nodes in a weighted graph.
                </p>
                <p>
                  <strong>Time Complexity:</strong> O((V + E) log V) where V is vertices and E is edges.
                </p>
                <p>
                  <strong>Use Case:</strong> Optimal for finding shortest delivery routes with positive edge weights.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Network Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentScenario.restaurants.length}
                  </div>
                  <div className="text-gray-600">Restaurants</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentScenario.customers.length}
                  </div>
                  <div className="text-gray-600">Customers</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentScenario.intersections.length}
                  </div>
                  <div className="text-gray-600">Intersections</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentScenario.edges.length}
                  </div>
                  <div className="text-gray-600">Connections</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;