import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();

async function detectFace(fileName: string) {
    try {
        console.log(`Running logo detection on ${fileName}`);
        const [result] = await client.logoDetection(fileName);
        let scores: number[] = [];
        const logos = result.logoAnnotations;
        logos?.forEach((logo) => {
            if (logo.description)
                console.log(`"${logo.description}" found in in file ${fileName}`);
            if (logo.score)
                scores.push(logo.score);
        });
        const avg = scores.reduce((a, b) => a + b) / scores.length;
        console.log(`Average score for ${fileName}: ${avg}`);
    } catch (err: any) {
        if (err.code == 'ENOENT')
            console.error(`File ${fileName} not found`);
    }
}

/**
 * Runs logo detection on the given list of file names and logs the description and average score of each logo.
 * @param fileNames - An array of file names to run logo detection on.
 * @returns void
 */
function main (fileNames: string[]): void {
    fileNames.forEach((fileName: string) => {
        console.log(`Running logo detection on ${fileName}`);
        client.logoDetection(fileName)
        .then(([result]) => {
            let scores: number[] = [];
            const logos = result.logoAnnotations;
            logos?.forEach((logo) => {
                if (logo.description)
                    console.log(`"${logo.description}" found in in file ${fileName}`);
                if (logo.score)
                    scores.push(logo.score);
            });
            const avg = scores.reduce((a, b) => a + b) / scores.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        })
        .catch((err) => {
            if (err.code === 'ENOENT')
                console.error(`File ${fileName} not found`);
            else if (err.code == 7)
                console.error(err.details);
        });
    });
}

// Implement the async version of the above here
// Your version should not use .then and should use try/catch instead of .catch
function mainAsync(fileNames: string[]) {
    fileNames.forEach(async (fileName: string) => {
        try {
            await detectFace(fileName);
        } catch (error) {
            console.error(`Error detecting logo in ${fileName}`);
        }
    })
}

main([
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
]);

// Sleep for 5 seconds
await new Promise(r => setTimeout(r, 5000));

mainAsync([
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
]);
