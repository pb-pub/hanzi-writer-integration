import "@logseq/libs"
import HanziWriter from "hanzi-writer";
import pinyin from "pinyin";

import {getTextHanzi} from "./utils/utils.ts";
import {provideStyles} from "./utils/logseq/styles.ts"
import { hanziHtml } from "./utils/hanziSvg.ts";
import { settingsConfig } from "./utils/settings/settingsConfig.ts";

var padding = 5;
var hanziQuizSize = 150;
var hanziSVGSize = 150;
var writerHashMap = {};
var writerIsQuizMap = {};  // Track quiz state for each writer



function main() {

  logseq.useSettingsSchema(settingsConfig);
  hanziQuizSize = logseq.settings?.["hanziQuizSize"] ?? 150;
  hanziSVGSize = logseq.settings?.["hanziSVGSize"] ?? 150;


  provideStyles(hanziQuizSize, hanziQuizSize);
  
  const genRandomStr = () => Math.random().
    toString(36).
    replace(/[^a-z]+/g, '').
    substr(0, 5);

  try {
    // Test if we can create a HanziWriter instance
    var testWriter = HanziWriter.create(document.createElement('div'), '测', {
      width: 100,
      height: 100
    });
    if (testWriter) {
      logseq.UI.showMsg('Hanzi Writer Plugin Loaded Successfully');
    }
  } catch (error) {
    console.error('HanziWriter initialization failed:', error);
    logseq.UI.showMsg('Hanzi Writer Plugin Failed to Load: ' + error.message);
    return;
  }

  logseq.onSettingsChanged(() => {
    
  hanziQuizSize = logseq.settings?.["hanziQuizSize"] ?? 150;
  hanziSVGSize = logseq.settings?.["hanziSVGSize"] ?? 150;
  }); 


  logseq.Editor.registerSlashCommand(
    'Hanzi quiz 🈚',
    async () => {
      const str = genRandomStr();
      await logseq.Editor.insertAtEditingCursor(
        `{{renderer :hanzi-quiz_${str}_}}`
      );
    }
  );

  // Handle macro renderer
  logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
    const [type, _] = payload.arguments;
    if (!type?.startsWith(':hanzi-quiz_')) return;

    const quizId = type.split('_')[1]?.trim();
    const hanziString = type.split('_')[2]?.trim() || '你';
    const hanziArray = Array.from(hanziString); // Split into individual characters

    if (!quizId) return;

    // Start quiz when button is clicked
    logseq.provideModel({
      startQuiz: (e) => {
        const quizId = e.dataset.quizId;

        if (writerHashMap[quizId]) {
          if (writerIsQuizMap[quizId]) {
            // Switch back to character mode
            writerHashMap[quizId].forEach(writer => {
              writer.cancelQuiz();
              writer.showCharacter();
              writer.showOutline();
              writer.animateCharacter();
            });
            writerIsQuizMap[quizId] = false;
          } else {
            // Switch to quiz mode
            writerHashMap[quizId].forEach(writer => {
              writer.hideCharacter();
              writer.hideOutline();
              writer.quiz({
                onComplete: () => {
                  logseq.UI.showMsg("Quiz completed!");
                  writerIsQuizMap[quizId] = false; // Reset state on completion
                }
              });
            });
            writerIsQuizMap[quizId] = true;
          }
        }
      }
    });

    logseq.provideUI({
      key: "hanzi_quiz-" + quizId,
      slot, reset: true,
      template: `
            <div class="hanzi">
                <div class="hanzi-container">
                    ${hanziArray.map((char, index) => `
                        <div class="hanzi-quiz" id="hanzi-quiz-${quizId}-${index}"></div>
                    `).join('')}
                </div>
                <button class="hanzi-quiz-button" 
                    data-quiz-id="${quizId}"
                    data-on-click="startQuiz">Switch Mode</button>
            </div>
        `
    });

    renderQuiz(hanziArray, quizId);
  });


  logseq.Editor.registerSlashCommand(
    "Hanzi image 🈚",
    
    
    async () => {

      const hanzi = await getTextHanzi();
      let html = "@@html: <div style='display: flex; flex-direction: row;'>";
      for (const char of hanzi) {
        html += await hanziHtml(char, hanziSVGSize, "#888");
      }
      
      html.replace(/\n/g, '');
      if (html != "@@html: <div style='display: flex; flex-direction: row;'>")
        logseq.Editor.insertAtEditingCursor(html + "</div> @@");
    }
  );
  

  logseq.Editor.registerSlashCommand(
    'pinyin',
    async () => {

      const text = await getTextHanzi();
      
      // Call pinyin synchronously
      const pinyinResult = pinyin(text, {
        style: pinyin.STYLE_TONE
      });

      logseq.UI.showMsg(text + " -> " + pinyinResult);
      logseq.Editor.insertAtEditingCursor(pinyinResult.join(' '));  
    }
  );

  logseq.Editor.registerSlashCommand(
    'exclude from graph view',
    async () => {
      logseq.Editor.insertAtEditingCursor(`exclude-from-graph-view:: true`);
    }
  );
}





async function renderQuiz(hanziArray, quizId) {
  await new Promise(resolve => setTimeout(resolve, 100));

  writerHashMap[quizId] = [];
  writerIsQuizMap[quizId] = false;  // Initialize quiz state

  hanziArray.forEach((hanzi, index) => {
    const quizEl = parent.document.getElementById(`hanzi-quiz-${quizId}-${index}`);
    if (!quizEl) {
      logseq.UI.showMsg(`Quiz element not found for ${quizId}-${index}`);
      return;
    }

    const writer = HanziWriter.create(quizEl, hanzi, {
      width: hanziQuizSize,
      height: hanziQuizSize,
      padding: padding,
      renderer: 'canvas',
      showHintAfterMisses: 3,
      showOutline: true,
    });

    writerHashMap[quizId].push(writer);
    writer.animateCharacter();
  });
}


// bootstrap
if (window.logseq) {
  logseq.ready(main).catch(console.error);
}
