import './card.css';
import { generateQuizText, generateHanziHTML } from '../utils/commandUtils/editorCommands';
import pinyin from 'pinyin';

export function createCardUI(): HTMLElement {
    const card = document.createElement('div');
    card.classList.add('hanzi-card');

    // Create form container
    const form = document.createElement('div');
    form.classList.add('hanzi-form');

    // Create text inputs
    const inputs = [
        { name: 'Translation', id: 'translation-' + Date.now() },
        { name: 'Hanzi', id: 'hanzi-' + Date.now() },
        { name: 'Description', id: 'description-' + Date.now() }
    ];

    inputs.forEach(input => {
        const container = document.createElement('div');
        container.classList.add('input-container');

        const label = document.createElement('label');
        label.textContent = input.name;
        label.htmlFor = input.id;

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.id = input.id;
        inputElement.name = input.id;

        container.appendChild(label);
        container.appendChild(inputElement);
        form.appendChild(container);
    });

    // Create checkboxes with unique IDs
    const checkboxes = [
        { name: 'Hanzi Quiz', id: 'hanziQuiz-' + Date.now(), defaultChecked: false },
        { name: 'Hanzi Image', id: 'hanziImage-' + Date.now(), defaultChecked: true },
        { name: 'Bidirectional', id: 'bilateral-' + Date.now(), defaultChecked: true }
    ];

    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkbox-container');

    checkboxes.forEach(checkbox => {
        const container = document.createElement('div');
        container.classList.add('checkbox-item');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = checkbox.id;
        input.name = checkbox.id;
        input.checked = checkbox.defaultChecked

        const label = document.createElement('label');
        label.textContent = checkbox.name;
        label.htmlFor = checkbox.id;

        container.appendChild(input);
        container.appendChild(label);
        checkboxContainer.appendChild(container);
    });

    form.appendChild(checkboxContainer);

    // Function to handle form submission
    const handleSubmit = async () => {
        // Get values using the unique IDs
        const traduction = (document.getElementById(inputs[0].id) as HTMLInputElement)?.value || '';
        const hanzi = (document.getElementById(inputs[1].id) as HTMLInputElement)?.value || '';
        const description = (document.getElementById(inputs[2].id) as HTMLInputElement)?.value || '';

        const hanziQuiz = (document.getElementById(checkboxes[0].id) as HTMLInputElement)?.checked || false;
        const hanziImage = (document.getElementById(checkboxes[1].id) as HTMLInputElement)?.checked || false;
        const bilateral = (document.getElementById(checkboxes[2].id) as HTMLInputElement)?.checked || false;

        try {
            // Create the main card block with title and tags
            const cardBlock = await logseq.Editor.getCurrentBlock();

            if (!cardBlock) {
                throw new Error("Failed to get card block");
            }

            await logseq.Editor.insertAtEditingCursor(`### ${traduction} #card ${bilateral ? '#bidirectional' : ''}`);

            // Add pinyin pronunciation
            const pinyinResult = pinyin(hanzi, { style: pinyin.STYLE_TONE });
            await logseq.Editor.insertBlock(
                cardBlock.uuid,
                `${hanzi} : ${pinyinResult.join(' ')}`,
                { sibling: false }
            );

            // Add description if provided
            if (description) {
                await logseq.Editor.insertBlock(
                    cardBlock.uuid,
                    description,
                    { sibling: false }
                );
            }

            // Add HanziQuiz if selected
            if (hanziQuiz) {
                await logseq.Editor.insertBlock(
                    cardBlock.uuid,
                    generateQuizText(hanzi),
                    { sibling: false }
                );
            }

            // Add Hanzi Image if selected
            if (hanziImage) {
                const html = await generateHanziHTML(hanzi);
                if (html !== "@@html: <div style='display: flex; flex-direction: row;'>") {
                    await logseq.Editor.insertBlock(
                        cardBlock.uuid,
                        html + "</div> @@",
                        { sibling: false }
                    );
                }
            }

            logseq.UI.showMsg("Card created successfully!", "success");
        } catch (error) {
            console.error("Error creating card:", error);
            logseq.UI.showMsg("Error creating card", "error");
        }

        cleanup();
    };

    // Function to cleanup and close
    const cleanup = () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('click', handleClickOutside);
        form.removeEventListener('keydown', handleFormKeydown);
        card.remove();
        logseq.hideMainUI({ restoreEditingCursor: true });
    };

    // Event handler functions
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            cleanup();
        }
        e.stopPropagation();
    };

    const handleFormKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('.hanzi-card')) {
            cleanup();
        }
    };

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', cleanup);

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', handleSubmit);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(closeButton);
    form.appendChild(buttonContainer);

    card.appendChild(form);

    // Add event listeners
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    form.addEventListener('keydown', handleFormKeydown);

    return card;
}