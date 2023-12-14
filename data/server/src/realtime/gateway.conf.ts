export const WebSocketGatewayOptions = {
  cors: {
    origin: `${process.env.VUE_APP_CUICUI}:8080`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // transports: ['websocket'],
  namespace: 'social',
};
