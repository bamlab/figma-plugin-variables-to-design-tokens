import {
  Code,
} from "@create-figma-plugin/ui";
import { h } from "preact";

export const CodeBlock = ({ code }: { code: string | null | undefined }) => {
  if (!code) return null;

  return (
    <div>
      <div style={{ marginTop: 16, fontSize: 20 }}>Exported code preview:</div>
      <div style={{ marginTop: 4, fontSize: 12 }}>(formatting will be up to you)</div>
      <div
        style={{
          backgroundColor: "var(--figma-color-bg-brand-tertiary)",
          marginTop: 8,
          padding: 16,
          width: "100%",
          userSelect: "text",
          wordBreak: "break-all",
        }}
      >
        <Code>{code}</Code>
      </div>
    </div>
  );
};
