import { db } from "./index";
import { messages } from "./schema";
import { eq, desc } from "drizzle-orm";

export function listWishes() {
  return db.select().from(messages).orderBy(desc(messages.id)).all();
}

export function addMessage(text: string, recipient: string, author?: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  const res = db
    .insert(messages)
    .values({
      text,
      author,
      recipient,
      createdAt: timestamp,
    })
    .run();

  return { id: Number(res.lastInsertRowid) };
}

export function fulfillMessage(id: number) {
  db.update(messages).set({ fulfilled: 1 }).where(eq(messages.id, id)).run();
}

export function deleteMessage(id: number) {
  const res = db.delete(messages).where(eq(messages.id, id)).run();
  return { changes: res.changes };
}

export function updateMessage(id: number, newMessage: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  const res = db
    .update(messages)
    .set({ text: newMessage, updatedAt: timestamp })
    .where(eq(messages.id, id))
    .run();
  return { changes: res.changes };
}

export async function getMessage(id: number) {
  const res = await db
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
