import { createWorker } from 'tesseract.js';
import Jimp from 'jimp';
const worker = await createWorker();

async function boxit()
{
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    let test = "receipts/test.jpg"
    let box = "receipts/box.jpg"

    const pic = new Jimp(test)
    const { data: { lines } } = await worker.recognize(test);
    
    for (let i = 0; i < lines.length; i++)
    {
        for (let j = 0; j < lines[i].words.length; j++)
        {
            let l = lines[i];
            let h = l.words[j].bbox.y1 - l.words[j].bbox.y0;
            let w = l.words[j].bbox.x1 - l.words[j].bbox.x0;

            if (l.words[j].confidence > 70)
            {  
            console.log("line: " + i + ": " + l.words[j].confidence);
                try
                {
                    await pic.scan(l.words[j].bbox.x0, l.words[j].bbox.y0 - 1, w + 1, 1, funcy(0xFF0000FF)).writeAsync(box); // top
                    await pic.scan(l.words[j].bbox.x0 - 1, l.words[j].bbox.y0, 1, h + 1, funcy(0xFF0000FF)).writeAsync(box); // left
                    await pic.scan(l.words[j].bbox.x1, l.words[j].bbox.y0 - 1, 1, h + 1, funcy(0xFF0000FF)).writeAsync(box); // right
                    await pic.scan(l.words[j].bbox.x0 - 1, l.words[j].bbox.y1, w + 1, 1, funcy(0xFF0000FF)).writeAsync(box); // bottom
                }catch(err) 
                {
                    console.log("error: " + err)
                    console.log("line: " + i + " " + l.words[j].text + " bbox-h: " + h + " bbox-w: " + w);
                }
            }
            else
            {
            await pic.scan(l.words[j].bbox.x0, l.words[j].bbox.y0, w, h, funcy(0x0000FFFF)).writeAsync(box);
            }   
        }
    }
    await worker.terminate();
};


function funcy(color)
{
    return function(x, y, offset) {
        this.bitmap.data.writeUInt32BE(color, offset);
    }
};

export default boxit;