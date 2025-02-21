import fs from 'fs';
import path from 'path';
import "@logseq/libs";

export async function svgExists(char) {
    const currentGraphFiles = await logseq.Assets.listFilesOfCurrentGraph();
    console.log(currentGraphFiles);
}





