import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput } from "@srthkm31/medium-common";
import { updateBlogInput } from "@srthkm31/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: number;
  };
}>();

//middleware
blogRouter.use("/*", async (c, next) => {
  const auth = c.req.header("Authorization") || "";
  try {
    const user = await verify(auth, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", Number(user.id));
      console.log(user.id);
      await next();
    } else {
      c.status(403);
      return c.text("You are not logged in. Log in to continue");
    }
  } catch (err) {
    c.status(403);
    return c.text("You are not logged in. Log in to continue");
  }
});

//get all blogs
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogPosts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json(blogPosts);
  } catch (err) {
    return c.text("Some internal error occured");
  }
});

//create blog
blogRouter.post("/create-blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = Number(c.get("userId"));
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.json({
      message: "Incorrect inputs",
    });
  }
  try {
    const blogPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        published: true,
      },
    });
    return c.json({
      id: blogPost.id,
    });
  } catch (err) {
    return c.text("Some error occured while creating blog");
  }
});
this;

//update blog
blogRouter.put("/update-blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = Number(c.get("userId"));
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.json({
      message: "Incorrect inputs",
    });
  }
  try {
    const blogPost = await prisma.post.update({
      where: {
        id: body.id,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.text("Blog updated successfully");
  } catch (err) {
    c.status(403);
    return c.text("Some error occured while updating the blog");
  }
});

//find blog
blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const postId = parseInt(c.req.param("id"));
  try {
    const blogPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!blogPost) {
      c.status(404);
      return c.text("Blog not found");
    }

    return c.json(blogPost);
  } catch (err) {
    c.status(500);
    return c.text("Some error occurred while getting the blog");
  }
});
