import "!prismjs/themes/prism.css";
import {
  Button,
  Code,
  Columns,
  Container,
  Layer,
  render,
  SegmentedControl,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { ConvertHandler, ConvertionDoneHandler } from "../common/types";
import { CollectionType } from "./types";
import { findModeId } from "./repository";
import { useModesSelection } from "./useSelectMode";

export interface PluginProps {
  collections: CollectionType[];
}

function Plugin({ collections }: PluginProps) {
  const [code, setCode] = useState<string | null>(null);

  const { selectedModes, setSelectedModes } = useModesSelection(collections);

  useEffect(() => {
    on<ConvertionDoneHandler>("CONVERSION_DONE", setCode);
  }, []);

  const convertVariablesToJson = () => {
    const modeSelections = Object.keys(selectedModes).map((collectionId) => ({
      collectionId,
      modeId: selectedModes[collectionId].modeId,
      modeName: selectedModes[collectionId].name,
    }));

    emit<ConvertHandler>("CONVERT_VARIABLES_TO_JSON", modeSelections);
  };

  const copyInClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
  };

  // TODO Force a conversion and wait for it to be ready
  const download = useDownloadOneTypescriptFile(selectedModes, code);

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      {collections.map(({ id, name, modes }) => (
        <Container key={id} space="small">
          <Columns>
            <Text>{name} :</Text>
            <SegmentedControl
              options={modes.map(({ name }) => ({ value: name }))}
              value={selectedModes?.[id]?.name}
              onChange={({ currentTarget: { value } }) => {
                setSelectedModes({
                  name: value,
                  collectionId: id,
                  modeId: findModeId(modes, value),
                });
                convertVariablesToJson();
              }}
            />
          </Columns>
          <VerticalSpace space="small" />
        </Container>
      ))}
      <VerticalSpace space="small" />
      <Button fullWidth onClick={convertVariablesToJson}>
        Convert variables to JSON
      </Button>
      <VerticalSpace space="small" />
      <Button fullWidth onClick={copyInClipboard}>
        Copy in clipboard
      </Button>
      <VerticalSpace space="small" />
      <Button fullWidth onClick={download}>
        Download
      </Button>
      <VerticalSpace space="small" />
      <CodeBlock code={code} />
      <VerticalSpace space="small" />
    </Container>
  );
}

const CodeBlock = ({ code }: { code: string | null | undefined }) => {
  if (!code) return null;

  return (
    <div>
      <div style={{ marginTop: 16, fontSize: 20 }}>Exported code preview:</div>
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

export default render(Plugin);

const getBaseFileNameFromSelectedModes = (selectedModes: {
  [key: string]: { modeId: string; name: string };
}) => {
  return (
    Array.from(
      new Set(Object.values(selectedModes).map((mode) => mode.name))
    ).join(".") + ".tokens.ts"
  );
};

function downloadTypescriptFile(code: string, filename: string) {
  const file = new Blob([code], { type: "text/plain" });
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  element.remove();
}

function useDownloadOneTypescriptFile(
  selectedModes: { [key: string]: { modeId: string; name: string } },
  code: string | null
) {
  return () => {
    const baseFileName = getBaseFileNameFromSelectedModes(selectedModes);

    if (!code) {
      throw new Error("No code to download!");
    }
    downloadTypescriptFile(code, baseFileName);
  };
}
