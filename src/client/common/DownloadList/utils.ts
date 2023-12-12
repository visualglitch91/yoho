import { round } from "$common/utils";

export function formatProgress(totalSize: number, percent: number): string {
  const downloadedSize = totalSize * percent;
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let size = totalSize;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const formattedDownloadedSize = round(downloadedSize / 1024 ** unitIndex, 2);
  const formattedTotalSize = `${round(size, 2)}${units[unitIndex]}`;

  return `${formattedDownloadedSize} / ${formattedTotalSize}`;
}
