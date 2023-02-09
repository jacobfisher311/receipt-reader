import { createWorker } from 'tesseract.js';
const worker = await createWorker();

async function analyze_receipt(input) {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { lines } } = await worker.recognize(input);
    
    let arr = new Array(lines.length);
    let totalConfidence = 0;
    for (let i = 0; i < lines.length; i++)
    {
      arr[i] = [lines[i].text, lines[i].confidence];
    }
    await worker.terminate();
    return arr;
  };

  export default analyze_receipt;