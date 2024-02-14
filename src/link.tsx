import type { PropsWithChildren } from "hono/jsx";

type ComponentMapModule = {
  getComponentPath: (component: () => JSX.Element) => string | undefined;
};

const layoutPath = `${process.cwd()}/.bext/ComponentMap.ts`;
const componentMapModule = require(layoutPath) as ComponentMapModule;
const { getComponentPath } = componentMapModule;

type LinkProps = {
  fn: () => JSX.Element;
  class?: string;
};

export const Link: (props: PropsWithChildren<LinkProps>) => JSX.Element = (
  props
) => {
  const path = getComponentPath(props.fn);
  return (
    <a
      href={path}
      hx-target="#main"
      hx-push-url={path === "/" ? "/" : "true"}
      hx-sync="a:replace"
      class={props.class}
    >
      {props.children}
    </a>
  );
};
