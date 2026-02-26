import { useState, useCallback, type ComponentPropsWithoutRef, type ReactElement } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node !== null && 'props' in (node as ReactElement)) {
    return extractText((node as ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return '';
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
      onClick={handleCopy}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="sr-only">Copy code</span>
    </Button>
  );
}

export function CopyablePre(props: ComponentPropsWithoutRef<'pre'>) {
  const text = extractText(props.children);

  return (
    <div className="relative group">
      <pre {...props} />
      <CopyButton text={text} />
    </div>
  );
}
