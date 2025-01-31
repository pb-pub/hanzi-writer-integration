var padding = 5;
var width = 200;
var height = 200;
var writerHashMap = {};
var writerIsQuizMap = {};  // Track quiz state for each writer



function main() {


    logseq.provideStyle(
        `
    .hanzi {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        width: fit-content;
    }

    .hanzi-container {
        display: flex;
        flex-direction: row;
        gap: 16px;
    }

    .hanzi-quiz {  
        height: ${height}px;
        width: ${width}px;
        border: 1px solid #e5e7eb;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image:
          linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px);
        background-size:
          ${width / 2}px ${width / 2}px,
          ${height / 2}px ${height / 2}px;
    }

    .hanzi-quiz canvas {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }

    .hanzi-quiz-button {
        margin-top: 12px;
        padding: 8px 16px;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .hanzi-quiz-button:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .hanzi-quiz-button:active {
        background-color: #1d4ed8;
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .hanzi-quiz-button:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    `
    )

    const genRandomStr = () => Math.random().
        toString(36).
        replace(/[^a-z]+/g, '').
        substr(0, 5);

    try {
        // Test if we can create a HanziWriter instance
        const testWriter = new window.HanziWriter(document.createElement('div'), '测', {
            width: 100,
            height: 100
        });
        if (testWriter) {
            logseq.App.showMsg('Hanzi Writer Plugin Loaded Successfully');
        }
    } catch (error) {
        console.error('HanziWriter initialization failed:', error);
        logseq.App.showMsg('Hanzi Writer Plugin Failed to Load: ' + error.message);
        return;
    }


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
        const [type, character] = payload.arguments;
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
                                    logseq.App.showMsg("Quiz completed!");
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
}

async function renderQuiz(hanziArray, quizId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    writerHashMap[quizId] = [];
    writerIsQuizMap[quizId] = false;  // Initialize quiz state

    hanziArray.forEach((hanzi, index) => {
        const quizEl = parent.document.getElementById(`hanzi-quiz-${quizId}-${index}`);
        if (!quizEl) {
            logseq.App.showMsg(`Quiz element not found for ${quizId}-${index}`);
            return;
        }

        const writer = HanziWriter.create(quizEl, hanzi, {
            width: height,
            height: width,
            padding: padding,
            renderer: 'canvas',
            showHintAfterMisses: 3,
            showOutline: true,
        });

        writerHashMap[quizId].push(writer);
        writer.animateCharacter();
    });
}

// Remove or comment out the switchToQuiz and switchToCharacter functions as they're no longer needed

// ensure we load after both logseq and HanziWriter are ready
if (window.logseq && window.HanziWriter) {
    logseq.ready(main).catch(console.error);
}
