# ✍️ Logseq HanziWriter Integration

A Logseq plugin that integrates [HanziWriter](https://hanziwriter.org/) to provide interactive Chinese character writing practice directly in your notes. 🇨🇳. It can also help you writing pinyins.

### 🎥 Demo

![demo](./demo/demo.gif)

#### Pinyin demo

![pinyin_demo](./demo/demo_pinyin.gif)

#### Hanzi svg demo

![Hanzi SVG demo](./demo/demo_hanzi_svg.gif)

#### Hanzi card demp

![Hanzi card demo](./demo/demo_card.gif)

## 🙏 Credits

This plugin uses [HanziWriter](https://hanziwriter.org/), created by [Chanind](https://github.com/chanind). HanziWriter is a free, open-source JavaScript library for Chinese character stroke order animations and quizzes.

## ✨ Features

- 🖌️ Interactive Chinese character stroke order animations
- ✏️ Practice writing characters with stroke order quizzes
- 📚 Support for multiple characters side by side
- 🔄 Toggle between animation and quiz modes
- ✅ Visual feedback for correct stroke order
- 💡 Hints available after 3 missed attempts

---
## 🚀 Usage

### Hanzi Quiz
1. Use the slash command `/Hanzi quiz 🈚` in any block
2. Type the character(s) you want to practice (e.g., `你好`)
3. A writing panel will appear with:
   - 🎯 Character animation showing stroke order
   - 🔄 "Switch Mode" button to toggle between animation and quiz modes
   - 📏 Grid background for proper character proportions

### Pinyin
Enhance your Chinese learning with integrated pinyin support:
- Type `/pinyin` following the Chinese characters to retrieve their pinyin transcription.
- The plugin displays pinyin above or below each character, highlighting tones.

### Hanzi SVG
Used to export characters to Anki and to have only the character images
- Type `/hanzi image 🈚` in any block
- Leave the block (click elsewhere)

### Cards
Use it to make card easily
- Type `/hanzi card` in any block
- Fill the form
- it's all done

---

## 📥 Installation

1. Go to Logseq Settings -> Plugin Store
2. Search for "HanziWriter Integration"
3. Click Install

## 📄 License   

MIT License

## Author 

[pb-pub](https://github.com/pb-pub)

## 🌟 Acknowledgements

- 🖊️ [HanziWriter](https://hanziwriter.org/) by Chanind
- 🖊️ [pīnyīn (v3)](https://pinyin.js.org/en-US/)
- 🔌 [Logseq Plugin SDK](https://logseq.github.io/plugins/)
