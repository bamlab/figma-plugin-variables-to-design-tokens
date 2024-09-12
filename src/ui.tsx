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
import { ConvertionDoneHandler } from "./types";
import { TargetedEvent } from "preact/compat";

export interface PluginProps {
  collections: {
    id: string;
    name: string;
    modes: Array<{
      modeId: string;
      name: string;
    }>;
  }[];
}

function Plugin(props: PluginProps) {
  const convertVariablesToJson = async () => {
    emit("CONVERT_VARIABLES_TO_JSON");
  };
  const [json, setJson] = useState({});
  const [selectedModes, setSelectedModes] = useState<{
    [key: string]: string;
  }>(
    props.collections.reduce(
      (acc, collection) => ({
        ...acc,
        [collection.id]: collection.modes[0].name,
      }),
      {}
    )
  );

  useEffect(() => {
    on<ConvertionDoneHandler>("CONVERTION_DONE", (data) => {
      setJson(data);
    });
  }, []);

  function copyInClipboard(): void {
    const jsonText = JSON.stringify(json, null, 2);
    const textArea = document.createElement("textarea");
    textArea.value = jsonText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
  }

  function download(): void {
    const file = new Blob([JSON.stringify(json)], { type: "application/json" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "tokens.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element.remove();
  }

  function handleChange(
    event: TargetedEvent<HTMLInputElement, Event>,
    collectionId: string
  ): void {
    const newValue = event.currentTarget.value;
    setSelectedModes((prev) => ({
      ...prev,
      [collectionId]: newValue,
    }));
  }

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      {props.collections.map((collection) => {
        return (
          <Container space="small">
            <Columns>
              <Text>{collection.name} :</Text>
              <SegmentedControl
                options={collection.modes.map((mode) => ({ value: mode.name }))}
                value={selectedModes?.[collection.id]}
                onChange={(event) => handleChange(event, collection.id)}
              />
            </Columns>
            <VerticalSpace space="small" />
          </Container>
        );
      })}
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
        theme={"apathy"}
        src={json}
      />
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
