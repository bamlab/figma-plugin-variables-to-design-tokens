import "!prismjs/themes/prism.css";
import {
  Button,
  Columns,
  Container,
  render,
  SegmentedControl,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import ReactJson from "react-json-view";
import { ConvertHandler, ConvertionDoneHandler } from "./types";
import { TargetedEvent } from "preact/compat";

export interface PluginProps {
  collections: {
    id: string;
    name: string;
    modes: Array<{ modeId: string; name: string }>;
  }[];
}

function Plugin({ collections }: PluginProps) {
  const [json, setJson] = useState({});
  const [selectedModes, setSelectedModes] = useState<{
    [key: string]: { modeId: string; name: string };
  }>(
    collections.reduce(
      (acc, { id, modes }) => ({
        ...acc,
        [id]: { modeId: modes[0].modeId, name: modes[0].name },
      }),
      {}
    )
  );

  useEffect(() => {
    on<ConvertionDoneHandler>("CONVERTION_DONE", setJson);
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
    const jsonText = JSON.stringify(json, null, 2);
    navigator.clipboard.writeText(jsonText);
  };

  const download = () => {
    const fileName = Array.from(
      new Set(Object.values(selectedModes).map((mode) => mode.name))
    ).join(".");
    const file = new Blob([JSON.stringify(json)], { type: "application/json" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.tokens.json`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  const handleChange = (
    event: TargetedEvent<HTMLInputElement>,
    collectionId: string,
    modeId: string
  ) => {
    setSelectedModes((prev) => ({
      ...prev,
      [collectionId]: { modeId, name: event.currentTarget.value },
    }));
  };

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
              onChange={(event) =>
                handleChange(
                  event,
                  id,
                  modes.find((mode) => mode.name === event.currentTarget.value)
                    ?.modeId ?? ""
                )
              }
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
      <ReactJson
        displayDataTypes={false}
        enableClipboard={false}
        theme="apathy"
        src={json}
      />
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
