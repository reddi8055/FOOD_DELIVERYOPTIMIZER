// THIS WAS THE LOGIC THAT WE HAVE IMPLEMENTED IN THE WESBITE
#include <iostream>
using namespace std;

const int MAX = 100;
int graph[MAX][MAX];     // Adjacency matrix
int dist[MAX];           // Shortest distances
bool visited[MAX];       // Visited nodes
int parent[MAX];         // To store path

int INF = 9999;          // Large number as infinity substitute

void dijkstra(int V, int source) {
    for (int i = 0; i < V; i++) {
        dist[i] = INF;
        visited[i] = false;
        parent[i] = -1;
    }

    dist[source] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = -1;
        int minDist = INF;

        for (int i = 0; i < V; i++) {
            if (!visited[i] && dist[i] < minDist) {
                minDist = dist[i];
                u = i;
            }
        }

        if (u == -1) break;

        visited[u] = true;

        for (int v = 0; v < V; v++) {
            if (graph[u][v] != 0 && !visited[v] && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }
}

void printPath(int node) {
    if (node == -1) return;
    printPath(parent[node]);
    cout << node;
    if (parent[node] != -1) cout << " -> ";
}

int main() {
    int V, E;
    cout << "Enter number of locations (nodes): ";
    cin >> V;

    cout << "Enter number of roads (edges): ";
    cin >> E;

    // Initialize graph
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            graph[i][j] = 0;

    cout << "Enter edges in the format: from to distance\n";
    for (int i = 0; i < E; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        graph[u][v] = w;
        graph[v][u] = w;
    }

    int source, destination;
    cout << "Enter source location (restaurant node): ";
    cin >> source;

    cout << "Enter destination location (customer node): ";
    cin >> destination;

    dijkstra(V, source);

    if (dist[destination] == INF) {
        cout << "?? No delivery path from location " << source << " to " << destination << ".\n";
    } else {
        cout << "?? Shortest delivery path from location " << source << " to " << destination
             << " is: " << dist[destination] << " units\n";
        cout << "?? Path: ";
        printPath(destination);
        cout << endl;
    }

    return 0;
}

