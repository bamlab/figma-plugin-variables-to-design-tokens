import "!prismjs/themes/prism.css";

import {
  Button,
  Container,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";

function Plugin() {
  const convertVariablesToJson = async () => {
    emit("CONVERT_VARIABLES_TO_JSON");
  };

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      <Button fullWidth onClick={convertVariablesToJson}>
        Convert variables to JSON
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
