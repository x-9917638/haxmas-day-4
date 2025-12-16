import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  getMessage,
  addMessage,
  fulfillMessage,
  updateMessage,
} from "./db/queries";
import { index } from "./page";

const app = new Hono();

app.get("/", (c) => {
  return c.html(index);
});

app.get("/api/messages/:id/:name?", async (c) => {
  const id = Number(c.req.param("id"));
  const name = c.req.param("name");

  if (name === undefined) {
    throw new HTTPException(403, { message: "403 Forbidden\n" });
  }

  if (!Number.isFinite(id)) {
    throw new HTTPException(400, { message: "400 Bad Request\n" });
  }

  const { data } = await getMessage(c.env.beans_db, id);

  if (data === undefined)
    throw new HTTPException(404, { message: "404 Not Found\n" });

  const { text, author, recipient, fulfilled } = data;

  if (recipient !== name) {
    throw new HTTPException(401, { message: "401 Unauthorized\n" });
  }

  if (fulfilled) {
    throw new HTTPException(403, { message: "403 Forbidden\n" });
  }

  await fulfillMessage(c.env.beans_db, id);

  if (author) {
    return c.json({ message: text, from: author });
  }
  return c.json({ message: text });
});

app.post("/api/messages/update/:id", async (c) => {
  const body = await c.req.json().catch(() => null);

  const message = (body?.message ?? "").toString().trim();
  const id = Number(c.req.param("id"));
  const name = (body?.recipient ?? undefined)?.toString().trim();

  if (name === undefined) {
    throw new HTTPException(403, { message: "403 Forbidden\n" });
  }

  if (!Number.isFinite(id)) {
    throw new HTTPException(400, { message: "400 Bad Request\n" });
  }

  const { data } = await getMessage(c.env.beans_db, id);

  if (data === undefined)
    throw new HTTPException(404, { message: "404 Not Found\n" });

  const { recipient, fulfilled, ...other } = data;

  if (recipient !== name) {
    throw new HTTPException(401, { message: "401 Unauthorized\n" });
  }

  if (fulfilled) {
    throw new HTTPException(403, { message: "403 Forbidden\n" });
  }

  return c.json(await updateMessage(c.env.beans_db, id, message));
});

app.post("/api/messages/new", async (c) => {
  const body = await c.req.json().catch(() => null);
  const message = (body?.message ?? "").toString().trim();
  const author = (body?.author ?? null)?.toString().trim();
  const recipient = (body?.recipient ?? "").toString().trim();

  if (!message || !recipient)
    return c.json(
      { error: "Both a message and recipient are required\n" },
      400,
    );

  return c.json(
    await addMessage(c.env.beans_db, message, recipient, author),
    201,
  );
});

const port = Number(process.env.PORT) || 3000;

export default {
  port,
  fetch: app.fetch,
};
