import { schema, table, t } from 'spacetimedb/server';

const spacetimedb = schema({
  creator: table(
    { name: "creator", public: true },
    {
      name: t.string(),
      password: t.string(),
    }
  ),
  // unhashed discord image url
  durl: table(
    { name: "discordurl", public: true },
    {
      creator: t.string(),
      url: t.string(),
      id: t.u64().primaryKey().autoInc(),
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

export const addDURL = spacetimedb.reducer(
  {
    creator: t.string(),
    url: t.string()
  }, (ctx, { creator, url }) => {
    ctx.db.durl.insert({
      creator,
      url,
      id: 0n,
    })
  }
)

export const removeDURL = spacetimedb.reducer(
  { id: t.u64().optional(), url: t.string().optional() },
  (ctx, { id, url }) => {
    if (id !== undefined) {
      ctx.db.durl.id.delete(id);
      return;
    }

    if (url !== undefined && url !== '') {
      for (const row of ctx.db.durl.iter()) {
        if (row.url === url) {
          ctx.db.durl.id.delete(row.id);
          return;
        }
      }
    }
  }
)

export const sayHello = spacetimedb.reducer(ctx => {
  for (const person of ctx.db.creator.iter()) {
    console.info(`Hello, ${person.name}!`);
  }
  console.info('Hello, World!');
});
