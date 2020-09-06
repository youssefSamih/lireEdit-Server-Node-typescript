import { MikroORM } from "@mikro-orm/core";
import { __prod__, COOKIE_NAME } from "./contants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
// import { sendEmail } from "./utils/sendEmail";
// import { User } from "./entities/user";

const main = async function(){
  const orm = await MikroORM.init(microConfig);
  // await orm.em.nativeDelete(User, {});
  // sendEmail('youssef.samih97@gmail.com', 'hello');
  await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ 
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: __prod__ // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'youssefdev',
      resave: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
      redis
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false
  });
  app.listen(4000, function() {
    console.log('server started on http://localhost:4000/graphql');
  });
}

main().catch(function(err) {
  console.error(err);
});
