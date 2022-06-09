import jimp from 'jimp'

export function pngToJpeg(image: Buffer) {
  return jimp.read(image).then((image) => image.getBufferAsync(jimp.MIME_JPEG))
}
