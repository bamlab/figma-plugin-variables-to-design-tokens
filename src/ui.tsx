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
    modes: Array<{
      modeId: string;
      name: string;
    }>;
  }[];
}

function Plugin(props: PluginProps) {
  const [json, setJson] = useState({});
  const [selectedModes, setSelectedModes] = useState<{
    [key: string]: { modeId: string; name: string };
  }>(
    props.collections.reduce(
      (acc, collection) => ({
        ...acc,
        [collection.id]: {
          modeId: collection.modes[0].modeId,
          name: collection.modes[0].name,
        },
      }),
      {}
    )
  );

  useEffect(() => {
    on<ConvertionDoneHandler>("CONVERTION_DONE", (data) => {
      setJson(data);
    });
  }, []);

  const convertVariablesToJson = async () => {
    emit<ConvertHandler>(
      "CONVERT_VARIABLES_TO_JSON",
      Object.keys(selectedModes).map((collectionId) => ({
        collectionId,
        modeId: selectedModes[collectionId].modeId,
        modeName: selectedModes[collectionId].name,
      }))
    );
  };

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
    const nameArray = Object.values(selectedModes).map((mode) => mode.name);
    const fileName = Array.from(new Set(nameArray)).join(".");

    const file = new Blob([JSON.stringify(json)], { type: "application/json" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.tokens.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element.remove();
  }

  function handleChange(
    event: TargetedEvent<HTMLInputElement, Event>,
    collectionId: string,
    modeId: string
  ): void {
    const newValue = event.currentTarget.value;
    setSelectedModes((prev) => ({
      ...prev,
      [collectionId]: {
        modeId: modeId,
        name: newValue,
      },
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
                value={selectedModes?.[collection.id].name}
                onChange={(event) =>
                  handleChange(
                    event,
                    collection.id,
                    collection.modes.find(
                      (mode) => mode.name === event.currentTarget.value
                    )?.modeId ?? ""
                  )
                }
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
