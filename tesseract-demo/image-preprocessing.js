import Jimp from 'jimp';

const preprocessedImage = "receipts/preprocessedImage.jpg";

async function preprocess(input)
{
  Jimp.read(input).then(image => {
    console.log("height: " + image.bitmap.height)
    console.log("width: " + image.bitmap.width)
    return image
      .greyscale()           // Removes color from image
      .contrast(1)           // Increases contract by maximum value (an attempt at binarization)
      .brightness(0.15)      // Increases brightness of image by 15%
      .write(preprocessedImage);
  }).catch(err => {
    if (err) throw err;
  });
  return preprocessedImage;
}

export default preprocess;