import { Hono } from "hono";
import { sign } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signinInput } from "@srthkm31/medium-common";
import { signupInput } from "@srthkm31/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

//signup route
userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.json({
      message: "Incorrect inputs",
    });
  }
  try {
    const exisitngUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (exisitngUser) {
      c.status(403);
      return c.text("user is present with this email ");
    } else {
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });

      const token = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({
        jwt_token: token,
      });
    }
  } catch (err) {
    c.status(403);
    return c.text("Some internal error occured while signing up");
  }
});

//signin route
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.json({
      message: "Incorrect inputs",
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!user) {
      c.status(403);
      return c.text("No user found or incorrect credentials");
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt_token: token,
    });
  } catch (err) {
    c.status(403);
    return c.text("Some internal error occured while signin in");
  }
});

userRouter.get("/getName/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const idParam = c.req.param("id");
  const id = parseInt(idParam);
  console.log(id);
  console.log(id);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.text("User not found");
    }

    return c.json({
      userId: user,
    });
  } catch (err) {
    c.status(500);
    return c.text("Some error occurred while getting the author name");
  }
});
