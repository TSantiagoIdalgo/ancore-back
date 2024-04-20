import { ApolloServer } from '@apollo/server';
import { DocumentNode } from 'graphql';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { tokenVerify } from './helpers/token';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import express from 'express';
import cors from 'cors';
import productRouter from './route/product/productRoute';
import paymentRouter from './route/payment/paymentRoute';
import bannerRoute from './route/banner/bannerRoute';

const PORT = process.env.PORT || 8080;

async function Server (typeDefs: DocumentNode[], resolvers: any) {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const app = express();
  const httpServer = createServer(app);
  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ ApolloServerPluginDrainHttpServer({ httpServer }), { 
      async serverWillStart() { return { async drainServer() { await serverCleanup.dispose(); } }; },
    }]
  });

  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
  const serverCleanup = useServer({ schema }, wsServer);
  await apolloServer.start();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(fileUpload({ useTempFiles: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/graphql/upload', productRouter);
  app.use('/graphql/payment', paymentRouter);
  app.use('/graphql/banner', bannerRoute);
  app.use('/graphql', 
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        const decodedToken = tokenVerify(req);
        return { res, decodedToken };
      }
    }));

  httpServer.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}/graphql`));
}

export default Server;