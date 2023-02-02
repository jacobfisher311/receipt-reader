/**********************************************************
 * To run, type in terminal: 
 *                           npm i
 *                           node index.js [imagepath]
 *********************************************************/
import path from 'path'
import analyze_receipt from './analyze-receipt.js';
import { colorContrast, individualText } from './image-preprocessing.js';

let defaultImagePath = "receipts/receipt2.jpeg";

try
{
  let userInput = process.argv[2];
  let imagePath = path.resolve(userInput || defaultImagePath)
  
  let contrastedImage = await colorContrast(imagePath);
  let boxes = await individualText(contrastedImage);
  await analyze_receipt("receipts/preprocessedImage.jpg");
}
catch(err)
{
  console.log(err);
}