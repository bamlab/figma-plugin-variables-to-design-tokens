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

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      <Button fullWidth onClick={convertVariablesToJson}>
        Convert variables to JSON
      </Button>
      <VerticalSpace space="small" />
      <ReactJson src={json} />
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
