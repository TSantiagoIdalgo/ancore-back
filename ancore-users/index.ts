import './src/database/sql/associations/associations';
import server, { ServerHandlers } from './src/server';
import sequelize from './src/database/sql/db';
import mongodb from './src/database/nosql/db';
import * as grpc from '@grpc/grpc-js';
const PORT = process.env.PORT ?? 8082;

(async function main() {
  try {
    await sequelize.sync({ force: true });
    console.log('Connection with database SQL has been established successfully');
    await mongodb();
    console.log('Connection with database NoSQL has been established successfully');
    ServerHandlers();
    console.log('ServerHandlers dons');
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
      server.start();
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();