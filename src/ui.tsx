import "!prismjs/themes/prism.css";

import {
  Button,
  Container,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import ReactJson from "react-json-view";
import { ConvertionDoneHandler } from "./types";

function Plugin() {
  const convertVariablesToJson = async () => {
    emit("CONVERT_VARIABLES_TO_JSON");
  };
  const [json, setJson] = useState({});

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

  return (
    <Container space="medium">
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
      <ReactJson src={json} />
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
