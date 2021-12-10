import { allSnippets } from ".contentlayer/data";
import { chakra } from "@chakra-ui/system";
import { FRAMEWORKS, useFramework } from "lib/framework";
import { useMDXComponent } from "next-contentlayer/hooks";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

function SnippetItem({ code, hidden }) {
  const content = useMDX(code);
  return (
    <div id="snippet" hidden={hidden}>
      {content}
    </div>
  );
}

const components: Record<string, FC<Record<string, any>>> = {
  h1(props) {
    return (
      <chakra.h1
        sx={{
          fontFamily: "The Seasons",
          fontSize: "3rem",
          maxW: "85ch",
          mb: "2rem",
        }}
        {...props}
      />
    );
  },
  h2(props) {
    return (
      <chakra.h2
        sx={{
          fontFamily: "The Seasons",
          fontSize: "2rem",
          mb: "1rem",
        }}
        {...props}
      />
    );
  },
  code(props) {
    if (typeof props.children === "string") {
      return (
        <chakra.code
          sx={{
            px: "4px",
            py: "2px",
            color: "purple",
            fontSize: "0.85em",
            fontFamily: "Menlo",
            whiteSpace: "nowrap",
          }}
          {...props}
        />
      );
    }
    return <>{props.children}</>;
  },
  InstallSnippet(props) {
    const { package: pkg, ...rest } = props;
    return (
      <pre {...rest}>{`
      npm install ${pkg}
      # or
      yarn add ${pkg}
      # or
      pnpm install ${pkg}
    `}</pre>
    );
  },
  CodeSnippet(props) {
    const userFramework = useFramework();
    const [framework, setFramework] = useState(userFramework ?? "react");

    useEffect(() => {
      if (userFramework && typeof userFramework === "string") {
        setFramework(userFramework);
      }
    }, [userFramework]);

    const snippets = allSnippets.filter((p) => p._id.endsWith(props.id));
    return (
      <div>
        <div>
          {FRAMEWORKS.map((f) => (
            <button onClick={() => setFramework(f)} key={f}>
              {f} {f === framework ? "x" : null}
            </button>
          ))}
        </div>
        {snippets.map((p) => (
          <SnippetItem
            key={p._id}
            code={p.body.code}
            hidden={p.framework !== framework}
          />
        ))}
      </div>
    );
  },
  a(props) {
    const href = props.href;
    const isInternalLink =
      href && (href.startsWith("/") || href.startsWith("#"));

    if (isInternalLink) {
      return (
        <Link href={href}>
          <a {...props}>{props.children}</a>
        </Link>
      );
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
};

export function useMDX(code: string) {
  const MDXComponent = useMDXComponent(code);
  return <MDXComponent components={components} />;
}