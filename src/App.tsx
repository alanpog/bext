import fs from "fs";
import withLayout from "./withLayout";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";

async function renderPageComponent(pageName: string, isHx: boolean) {
  let pagePath;
  try {
    pagePath = Bun.resolveSync(`./src/app/${pageName}/page.tsx`, process.cwd());
  } catch (error) {
    console.log("Page does not exist", error);
    return (
      <>
        <h1>404 Page Not Found</h1>
      </>
    );
  }

  if (fs.existsSync(pagePath)) {
    const PageComponent: { default: () => JSX.Element } = await import(
      pagePath
    );
    const WrappedPageComponent = withLayout(PageComponent.default, isHx);
    return (
      <>
        <WrappedPageComponent />
      </>
    );
  } else {
    return (
      <>
        <h1>404 Page Not Found!</h1>
      </>
    );
  }
}

type Variables = {
  isHx: boolean;
};

export const App = new Hono<{ Variables: Variables }>()
  .onError((err, c) => {
    console.log("Error", err.message, "Stack", err.stack);
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    return new Response("Hono error:" + err.message);
  })
  .use(async (c, next) => {
    const isHx = c.req.header("hx-request") === "true";
    c.set("isHx", isHx);
    return next();
  })
  .get(
    "/public/*",
    serveStatic({
      root: "./",
      onNotFound: (path, c) => {
        console.log(`${path} is not found, you accessed ${c.req.path}`);
        // You can return a custom response here if needed
      },
    })
  )
  .get("/", (c) => {
    const isHx = c.get("isHx");
    return c.html(renderPageComponent("", isHx));
  })
  .get("/*", (c) => {
    return c.html(renderPageComponent(c.req.path, c.get("isHx")));
  });
