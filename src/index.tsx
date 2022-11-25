import { List, ActionPanel, Action, Detail } from "@raycast/api";
import { getDesktopFilesNames, useExecCompress } from "./db/utils";

export default function Command() {
  const { isLoading, error, handleCompress } = useExecCompress();
  const filenames = getDesktopFilesNames("mov");

  if (error) {
    return <Detail markdown={JSON.stringify(error)} />;
  }

  return (
    <List isLoading={isLoading}>
      {filenames.map((filename) => (
        <List.Item
          key={filename}
          icon="list-icon.png"
          title={filename}
          actions={
            <ActionPanel>
              <Action title="Compress Video" onAction={() => handleCompress(filename)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
