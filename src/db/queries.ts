import { db } from "./index";
import { messages } from "./schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export async function addMessage(
  db,
  text: string,
  recipient: string,
  author?: string,
) {
  const timestamp = Math.floor(Date.now() / 1000);

  const res = await drizzle(db)
    .insert(messages)
    .values({
      text,
      author,
      recipient,
      createdAt: timestamp,
    })
    .run();

  return { id: Number(res.meta.last_row_id) };
}

export async function fulfillMessage(db, id: number) {
  await drizzle(db)
    .update(messages)
    .set({ fulfilled: 1 })
    .where(eq(messages.id, id))
    .run();
}

export async function deleteMessage(db, id: number) {
  const res = await drizzle(db)
    .delete(messages)
    .where(eq(messages.id, id))
    .run();
  return { changes: res.meta.changes };
}

export async function updateMessage(db, id: number, newMessage: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  const res = await drizzle(db)
    .update(messages)
    .set({ text: newMessage, updatedAt: timestamp })
    .where(eq(messages.id, id))
    .run();
  return { changes: res.meta.changes };
}

export async function getMessage(db, id: number) {
  const res = await drizzle(db)
    .select({
      text: messages.text,
      author: messages.author,
      recipient: messages.recipient,
      fulfilled: messages.fulfilled,
    })
    .from(messages)
    .where(eq(messages.id, id));
  if (res[0] === undefined) {
    return { data: undefined };
  }
  return { data: res[0] };
}
