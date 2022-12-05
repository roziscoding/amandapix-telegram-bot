import type { StorageAdapter } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import type { Collection } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export interface ISession {
  _id: { $oid: string };
  key: string;
  value: unknown;
}

export class MongoDBAdapter<T> implements StorageAdapter<T> {
  private collection: Collection<ISession>;

  constructor({ collection }: { collection: Collection<ISession> }) {
    this.collection = collection;
  }

  async read(key: string) {
    const session = await this.collection.findOne({ key });

    if (session === null || session === undefined) {
      return undefined;
    }

    return session.value as T;
  }

  async write(key: string, data: T) {
    await this.collection.updateOne(
      {
        key,
      },
      {
        $set: {
          key,
          value: data,
        },
      },
      { upsert: true, ignoreUndefined: true },
    );
  }

  async delete(key: string) {
    await this.collection.deleteOne({ key });
  }
}
