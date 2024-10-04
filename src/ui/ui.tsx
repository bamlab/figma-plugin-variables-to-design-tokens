import "!prismjs/themes/prism.css";
import {
  Button,
  Code,
  Columns,
  Container,
  Layer,
  LoadingIndicator,
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
import { CodeBlock } from "./components/CodeBlock";
import { useDownloadOneTypescriptFile } from "./download";

export interface PluginProps {
  collections: CollectionType[];
}

function Plugin({ collections }: PluginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const { selectedModes, setSelectedModes } = useModesSelection(collections);

  const onDone: ConvertionDoneHandler["handler"] = (arg) => {
    setCode(arg);
    setIsLoading(false);
  };

  useEffect(() => {
    on<ConvertionDoneHandler>("CONVERSION_DONE", onDone);
  }, []);

  const convertVariablesToJson = () => {
    const modeSelections = Object.keys(selectedModes).map((collectionId) => ({
      collectionId,
      modeId: selectedModes[collectionId].modeId,
      modeName: selectedModes[collectionId].name,
    }));

    setIsLoading(true);
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
              disabled={isLoading}
            />
          </Columns>
          <VerticalSpace space="small" />
        </Container>
      ))}
      <VerticalSpace space="small" />
      <Button disabled={isLoading} fullWidth onClick={convertVariablesToJson}>
        Convert variables to JSON
      </Button>
      <VerticalSpace space="small" />
      <Button disabled={isLoading} fullWidth onClick={copyInClipboard}>
        Copy in clipboard
      </Button>
      <VerticalSpace space="small" />
      <Button disabled={isLoading} fullWidth onClick={download}>
        Download
      </Button>
      <VerticalSpace space="small" />
      {isLoading ? <LoadingIndicator /> : <CodeBlock code={code} />}
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
