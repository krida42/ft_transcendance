export const WebSocketGatewayOptions = {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // transports: ['websocket'],
  namespace: 'social',
};
