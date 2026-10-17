import { marked } from "marked";

// Closing block tags and <br> become spaces so words from neighbouring
// lines never run together once the tags are gone.
const BLOCK_END = /<br\s*\/?>|<\/(?:p|li|h[1-6]|blockquote|pre|tr|div)>/gi;

export const getExcerpt = (markdown, maxLength = 200) => {
    if (!markdown) return "";

    const html = marked.parse(markdown).replace(BLOCK_END, " ");
    const text = (
        new DOMParser().parseFromString(html, "text/html").body.textContent || ""
    )
        .replace(/\s+/g, " ")
        .trim();

    if (text.length <= maxLength) return text;

    const cut = text.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(" ");
    const trimmed = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;
    return `${trimmed.trimEnd()}…`;
};
