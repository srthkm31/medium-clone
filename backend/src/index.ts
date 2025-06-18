import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";

const app = new Hono();
const allowedOrigins = [
  "http://localhost:5173",
  "https://medium-clone-srthk231ms-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, _c) => {
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return null;
    },
    credentials: true,
  })
);

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
