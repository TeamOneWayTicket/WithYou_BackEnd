export async function getUrl(fileName: string, size: number): Promise<string> {
  if (size == 0) {
    return 'https://resource.with-you.io/origins/' + fileName;
  }

  if (!(size == 200 || size == 400)) {
    return `https://resource.with-you.io/resized/w_200/` + fileName;
  }
  return `https://resource.with-you.io/resized/w_${size}/` + fileName;
}
