export function getUrl(fileName: string, size: number) {
  if (size == 0) {
    return 'https://resource.with-you.io/origins/' + fileName;
  }

  if (!(size == 480 || size == 960)) {
    return `https://resource.with-you.io/resized/w_200/` + fileName;
  }
  return `https://resource.with-you.io/resized/w_${size}/` + fileName;
}
