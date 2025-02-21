import "@logseq/libs";

export function isHanzi(char) {
  const code = char.charCodeAt(0);

  // Check for common Hanzi range
  if (code >= 0x4E00 && code <= 0x9FFF) {
    return true;
  }

  // Check for other Hanzi ranges
  if (code >= 0x3400 && code <= 0x4DBF) {
    return true;
  }

  // Check for CJK Unified Ideographs Extension B and beyond
  if (code >= 0x20000 && code <= 0x2EBEF) {
    return true;
  }

  // Check for CJK Compatibility Ideographs
  if (code >= 0xF900 && code <= 0xFAFF) {
    return true;
  }

  return false;
}


export async function getTextHanzi() {
  // Get every character behind the cursor until not a hanzi
  const cursor = await logseq.Editor.getEditingCursorPosition();
  const blockContent = await logseq.Editor.getEditingBlockContent();

  if (cursor) {
    let end = cursor.pos - 1;

    let start = cursor.pos - 2;
    while (start >= 0 && isHanzi(blockContent.charAt(start))) {
      // console.log("is a hanzi: " + blockContent.charAt(start));
      start--;
    }

    return blockContent.substring(start, end);
  }
  return "";

}