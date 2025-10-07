import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

let wss: WebSocketServer | null = null;

export function setupWebSocket(httpServer: Server) {
  // Avoid creating multiple WebSocket servers during HMR
  if (wss) {
    console.log('WebSocket server already initialized, skipping');
    return;
  }

  wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');

    // Heartbeat to keep connection alive
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000); // Ping every 30 seconds

    ws.on('pong', () => {
      console.log('Received pong from client');
    });

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      clearInterval(heartbeatInterval);
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      clearInterval(heartbeatInterval);
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket server initialized on path /ws');
}

// Broadcast boat update to all connected clients
export function broadcastBoatUpdate(boatId: string, status: string) {
  if (!wss) {
    console.warn('WebSocket server not initialized');
    return;
  }

  const message = JSON.stringify({
    type: 'boat_update',
    boatId,
    status,
    timestamp: new Date().toISOString(),
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log(`Broadcasted boat update: ${boatId} -> ${status}`);
}
