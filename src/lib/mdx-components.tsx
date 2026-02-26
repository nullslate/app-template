import type { MDXComponents } from "mdx/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyablePre } from "@/components/copyable-pre";

function CalloutCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4 mt-6">{children}</div>;
}

function MiniCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

export const docsMDXComponents: MDXComponents = {
  CalloutCard,
  CardGrid,
  MiniCard,
  h2: (props) => (
    <h2
      className="text-2xl font-bold mb-4 flex items-center gap-2"
      {...props}
    />
  ),
  h3: (props) => <h3 className="text-lg font-semibold mb-2 mt-6" {...props} />,
  p: (props) => <p className="text-muted-foreground mb-4" {...props} />,
  ul: (props) => (
    <ul className="list-disc pl-6 mb-4 space-y-1 text-muted-foreground" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1 text-muted-foreground" {...props} />
  ),
  li: (props) => <li className="text-muted-foreground" {...props} />,
  pre: CopyablePre,
  strong: (props) => <strong className="text-foreground" {...props} />,
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-primary hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
};
