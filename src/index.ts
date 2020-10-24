import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import connectRedis from 'connect-redis';
import session from 'express-session';
import express from 'express';
import { join } from 'path';
import Redis from 'ioredis';
import cors from 'cors';
import { COOKIE_NAME, __prod__ } from './contants';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { Updoot } from './entities/updoot';
import { Post } from './entities/post';
import { User } from './entities/user';

// import { sendEmail } from "./utils/sendEmail";
// import { User } from "./entities/user";

const main = async function () {
  const conn = await createConnection({
    type: 'postgres',
    database: 'lireedit2',
    // username: 'postgres',
    // password: 'root',
    logging: true,
    synchronize: true,
    migrations: [join(__dirname, './migrations/*')],
    entities: [Post, User, Updoot]
  });

  // conn.runMigrations();
  // Post.remove([]);
  // sendEmail('youssef.samih97@gmail.com', 'hello');
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: __prod__ // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'youssefdev',
      resave: false
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis
    })
  });

  apolloServer.applyMiddleware({
    app,
    cors: false
  });
  app.listen(4000, function () {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main().catch(function (err) {
  console.error(err);
});
