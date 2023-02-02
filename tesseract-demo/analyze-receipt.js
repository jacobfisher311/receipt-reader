import { createWorker } from 'tesseract.js';
const worker = await createWorker();

async function analyze_receipt(input) {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { lines } } = await worker.recognize(input);
    
    let totalConfidence = 0;
    for (let i = 0; i < lines.length; i++)
    {
      
      // text information
      console.log("line: " + i + " text: " + lines[i].text);
  
      // confidence
      totalConfidence += lines[i].confidence;
    
    }
    console.log("Avg confidence of document: " + totalConfidence / lines.length);
    await worker.terminate();
  };

  export default analyze_receipt;