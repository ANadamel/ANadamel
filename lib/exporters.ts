export function downloadTextFile(fileName: string, text: string, mimeType: string) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportSvgAsPng(svg: string, size = 1024): Promise<Blob> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas context.");
    }
    context.clearRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((output) => {
        if (!output) {
          reject(new Error("Could not export PNG."));
          return;
        }
        resolve(output);
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(fileName: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
