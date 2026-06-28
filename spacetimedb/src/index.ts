import { schema, table, t } from 'spacetimedb/server';

const spacetimedb = schema({
  creator: table(
    { name: "creator", public: true },
    {
      name: t.string(),
      password: t.string(),
    }
  ),
  /// filename scheme: creator-name.*
  image: table(
    { name: "image", public: true },
    {
      imageName: t.string(),
      creator: t.string(),
      id: t.u64().primaryKey().autoInc(),
      data: t.array(t.u8()),  // Binary data stored inline
      mimetype: t.string(),
    }
  )
});
export default spacetimedb;

export const init = spacetimedb.init(_ctx => {
  // Called when the module is initially published
});

export const onConnect = spacetimedb.clientConnected(_ctx => {
  // Called every time a new client connects
});

export const onDisconnect = spacetimedb.clientDisconnected(_ctx => {
  // Called every time a client disconnects
});

export const addCreator = spacetimedb.reducer(
  { name: t.string(), password: t.string() },
  (ctx, { name, password }) => {
    ctx.db.creator.insert({ name, password });
  }
);

export const addImage = spacetimedb.reducer(
  {
    imageName: t.string(),
    creator: t.string(),
    data: t.array(t.u8()),
    mimetype: t.string(),
  },
  (ctx, { imageName, creator, data, mimetype }) => {

    ctx.db.image.insert({
      imageName,
      creator,
      id: 0n,
      data,
      mimetype,
    });
  }
);

export const sayHello = spacetimedb.reducer(ctx => {
  for (const person of ctx.db.creator.iter()) {
    console.info(`Hello, ${person.name}!`);
  }
  console.info('Hello, World!');
});
