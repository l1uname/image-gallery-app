import firstCharToUpperCase from "../utils/first-char-uppercase.js";

export default function tagSelection(tag) {
    const tagsDiv = document.createElement('div')
    tagsDiv.innerHTML = `
    <label>${firstCharToUpperCase(tag)}</label>
    <input id="${tag}" type="checkbox">
    `
    return tagsDiv;
}