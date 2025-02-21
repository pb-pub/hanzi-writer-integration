import "@logseq/libs";
import HanziWriter from 'hanzi-writer';

export async function hanziHtml(char: string, size: number, couleur): Promise<string> {
    try {
        // Get character data
        const transform = HanziWriter.getScalingTransform(size, size);

        // Create background grid
        let characterSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"> <g transform="${transform.transform}">`;

       
        console.log(char);

        await HanziWriter.loadCharacterData(char).then(function (charData) {
            if (!charData) {
                console.error('Character data not found:', char);
                return;
            }
            
            charData.strokes.forEach(stroke => {
                characterSvg += `<path d="${stroke}" fill="${couleur}" stroke="${couleur}" stroke-width="2" />`;
            });
        });

        // Combine background and character
        const result = `${characterSvg}</g></svg>`;

        // remove line returns
        return result.replace(/\n/g, '');

    } catch (error) {
        console.error('Error generating Hanzi SVG:', error);
        return "";
    }
}

