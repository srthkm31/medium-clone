import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
  cors({
    origin: "http://localhost:5173", // or '*' to allow all origins (not recommended for prod)
  })
);

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
