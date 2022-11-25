import { useCallback, useState } from "react";
import fs from "fs";
import { homedir } from "os";
import path from "path";

import { ffmpeg } from "../lib/ffmpeg";
import { open } from "@raycast/api";

const desktopFolder = path.join(homedir(), "Desktop");

export function getDesktopFilesNames(ext?: string): string[] {
  if (ext === undefined) {
    return fs.readdirSync(desktopFolder);
  }

  return fs.readdirSync(desktopFolder).filter((names) => names.endsWith(`.${ext}`));
}

function compress(_filename: string) {
  const filename = path.parse(_filename);
  return ffmpeg(path.join(desktopFolder, filename.base))
    .inputOption(["-vcodec h264", "-acodec mp2"])
    .output(path.join(desktopFolder, filename.name + ".mp4"))
    .outputFormat("mp4");
}

interface UseExecCompressState {
  isLoading: boolean;
  error: null | string;
}

export function useExecCompress() {
  const [state, set] = useState<UseExecCompressState>({ isLoading: false, error: null });

  const setState = useCallback((patch: Partial<UseExecCompressState>) => {
    set((prevState) => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
  }, []);

  const handleCompress = useCallback((filename: string) => {
    setState({ isLoading: true, error: null });
    compress(filename)
      .on("end", () => {
        setState({ isLoading: false });
        open("raycast://confetti");
      })
      .on("error", (err) => setState({ isLoading: false, error: err.message }))
      .run();
  }, []);

  return { ...state, handleCompress };
}
