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

export function useDownloadOneTypescriptFile(
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
