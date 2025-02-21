
export function provideStyles(width, height) {
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

}