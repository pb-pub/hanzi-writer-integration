import "@logseq/libs"
import HanziWriter from "hanzi-writer";

import { provideStyles } from "./utils/logseq/styles"
import { settingsConfig } from "./utils/settings/settingsConfig"
import { createCardUI } from "./UI/cardUI"
import { createHanziQuizMacro, createHanziImage, createPinyin } from "./utils/commandUtils/editorCommands"

var padding = 5;
var hanziQuizSize = 150;
export var hanziSVGSize = 150;
var writerHashMap = {};
var writerIsQuizMap = {};  // Track quiz state for each writer



function main() {

  logseq.useSettingsSchema(settingsConfig);
  hanziQuizSize = logseq.settings?.["hanziQuizSize"] ?? 150;
  hanziSVGSize = logseq.settings?.["hanziSVGSize"] ?? 150;


  provideStyles(hanziQuizSize, hanziQuizSize);

 

  logseq.onSettingsChanged(() => {

    hanziQuizSize = logseq.settings?.["hanziQuizSize"] ?? 150;
    hanziSVGSize = logseq.settings?.["hanziSVGSize"] ?? 150;
  });


  logseq.Editor.registerSlashCommand(
    'Hanzi quiz 🈚',
    createHanziQuizMacro
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
    createHanziImage
  );

  logseq.Editor.registerSlashCommand(
    'pinyin',
    createPinyin
  );

  logseq.Editor.registerSlashCommand(
    'exclude from graph view',
    async () => {
      logseq.Editor.insertAtEditingCursor(`exclude-from-graph-view:: true`);
    }
  );

  logseq.Editor.registerSlashCommand(
    'Hanzi Card',
    async () => {
      const cardUI = createCardUI();
      // Get cursor position for positioning the popup
      const { left, top, rect } = await logseq.Editor.getEditingCursorPosition();
      
      // Position the card
      Object.assign(cardUI.style, {
        top: top + rect.top + 'px',
        left: left + rect.left + 'px',
      });
      
      // Add the card to the document
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.appendChild(cardUI);
      }
      
      // Show the UI
      logseq.showMainUI();
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
  logseq.UI.showMsg("Hanzi Writer loaded successfully!");
}
