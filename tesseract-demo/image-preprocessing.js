import { createWorker } from 'tesseract.js';
import Jimp from 'jimp';
const worker = await createWorker();

const preprocessedImage = "receipts/preprocessedImage.jpg";
const boxesImage = "receipts/box.jpg";

async function colorContrast(input)
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
}

async function individualText() {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const pic = new Jimp(preprocessedImage)
    const { data: { lines } } = await worker.recognize(preprocessedImage);
    
    for (let i = 0; i < lines.length; i++)
    {
        for (let j = 0; j < lines[i].words.length; j++)
        {
          let l = lines[i];
          let h = l.words[j].bbox.y1 - l.words[j].bbox.y0;
          let w = l.words[j].bbox.x1 - l.words[j].bbox.x0;

          if (l.words[j].confidence > 10)
          {  
              try
              {
                  await pic.scan(l.words[j].bbox.x0, l.words[j].bbox.y0 - 1, w + 1, 1, funcy(0xFF0000FF)).writeAsync(boxesImage); // top
                  await pic.scan(l.words[j].bbox.x0 - 1, l.words[j].bbox.y0, 1, h + 1, funcy(0xFF0000FF)).writeAsync(boxesImage); // left
                  await pic.scan(l.words[j].bbox.x1, l.words[j].bbox.y0 - 1, 1, h + 1, funcy(0xFF0000FF)).writeAsync(boxesImage); // right
                  await pic.scan(l.words[j].bbox.x0 - 1, l.words[j].bbox.y1, w + 1, 1, funcy(0xFF0000FF)).writeAsync(boxesImage); // bottom
              }catch(err) 
              {
                  console.log("error: " + err)
                  console.log("line: " + i + " " + l.words[j].text + " bbox-h: " + h + " bbox-w: " + w);
              }
          }
          else
          {
            try
              {
                  await pic.scan(l.words[j].bbox.x0, l.words[j].bbox.y0 - 1, w + 1, 1, funcy(0x0000FFFF)).writeAsync(boxesImage); // top
                  await pic.scan(l.words[j].bbox.x0 - 1, l.words[j].bbox.y0, 1, h + 1, funcy(0x0000FFFF)).writeAsync(boxesImage); // left
                  await pic.scan(l.words[j].bbox.x1, l.words[j].bbox.y0 - 1, 1, h + 1, funcy(0x0000FFFF)).writeAsync(boxesImage); // right
                  await pic.scan(l.words[j].bbox.x0 - 1, l.words[j].bbox.y1, w + 1, 1, funcy(0x0000FFFF)).writeAsync(boxesImage); // bottom
              }catch(err) 
              {
                  console.log("error: " + err)
                  console.log("line: " + i + " " + l.words[j].text + " bbox-h: " + h + " bbox-w: " + w);
              }
          }   
        }
    }
    await worker.terminate();
    return boxesImage;
  };
  
function funcy(color)
{
  return function(x, y, offset){
    this.bitmap.data.writeUInt32BE(color, offset);
  }
};

export { colorContrast, individualText };