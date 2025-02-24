import "@logseq/libs";
import pinyin from "pinyin";

import { getTextHanzi } from "../utils.ts";
import { hanziHtml } from "../hanziSvg.ts";
import { hanziSVGSize } from "../../index.ts";


const genRandomStr = () => Math.random().
toString(36).
replace(/[^a-z]+/g, '').
substr(0, 5);


export async function createHanziQuizMacro() {
    logseq.Editor.insertAtEditingCursor(
        generateQuizText()
    );
}

export async function createHanziImage() {
    const hanzi = await getTextHanzi();
    const html = await generateHanziHTML(hanzi);
    if (html != "@@html: <div style='display: flex; flex-direction: row;'>")
        logseq.Editor.insertAtEditingCursor(html + "</div> @@");
}

export async function createPinyin() {

    const text = await getTextHanzi();

    // Call pinyin synchronously
    const pinyinResult = pinyin(text, {
        style: pinyin.STYLE_TONE
    });

    logseq.UI.showMsg(text + " -> " + pinyinResult);
    logseq.Editor.insertAtEditingCursor(pinyinResult.join(''));
}


export async function generateHanziHTML(hanzi = "") {
    if (!hanzi) {
        return "@@html: <div style='display: flex; flex-direction: row;'>";
    }
    let html = "@@html: <div style='display: flex; flex-direction: row;'>";
    for (const char of hanzi) {
        html += await hanziHtml(char, hanziSVGSize, "#888");
    }

    html.replace(/\n/g, '');
    return html;
}

export function generateQuizText(hanzi =""){
    const str = genRandomStr();
    return `{{renderer :hanzi-quiz_${str}_${hanzi}}}`;
}