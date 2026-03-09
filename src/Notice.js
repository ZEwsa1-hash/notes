import { createElement } from './utils/createElement.js';

export class Notice {
  constructor(data = {}, onRemove, onBlur) {
    this.id = data.id || Date.now().toString();
    this.title = data.title || '';
    this.top = data.top || 20;
    this.left = data.left || 20;
    this.content = data.content || '';
    this.htmlElement = this.#getElement(onRemove, onBlur);
  }

  updatePosition(left, top) {
    this.left = left;
    this.top = top;
    this.htmlElement.style.left = `${left}px`;
    this.htmlElement.style.top = `${top}px`;
  }

  #getElement(onRemove, onBlur) {
    const padding = 8;

    const div = createElement('div');
    div.style.width = '150px';
    div.style.height = '150px';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '14px';
    div.style.position = 'absolute';
    div.style.top = `${this.top}px`;
    div.style.left = `${this.left}px`;
    div.style.background = 'white';
    div.style.zIndex = 0;
    div.style.padding = `${padding}px`;
    div.style.boxSizing = 'border-box';
    div.style.overflow = 'hidden';
    div.style.cursor = 'grab';
    div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

    // Title row
    const divTitle = createElement('div');
    divTitle.style.display = 'flex';
    divTitle.style.alignItems = 'center';
    divTitle.style.marginBottom = `${padding}px`;

    const h4 = createElement('h4');
    h4.textContent = this.title;
    h4.style.margin = '0';
    h4.style.overflow = 'hidden';
    h4.style.whiteSpace = 'nowrap';
    h4.style.textOverflow = 'ellipsis';
    h4.style.flexGrow = '1';
    h4.style.fontSize = '13px';

    const rmBtn = createElement('button');
    rmBtn.textContent = '×';
    rmBtn.style.padding = '0 4px';
    rmBtn.style.cursor = 'pointer';
    rmBtn.style.marginLeft = '6px';
    rmBtn.style.border = 'none';
    rmBtn.style.background = 'transparent';
    rmBtn.style.fontSize = '16px';
    rmBtn.style.lineHeight = '1';

    rmBtn.addEventListener('click', { once: true }, () => {
      div.remove();
      if (onRemove) onRemove(this.id);
    });

    divTitle.append(h4, rmBtn);

    // Textarea
    const textArea = createElement('textarea');
    textArea.value = this.content;
    textArea.style.width = `calc(100% - ${2 * padding}px)`;
    textArea.style.maxHeight = `calc(100% - ${h4.offsetHeight + padding * 2}px)`;
    textArea.style.overflow = 'hidden';
    textArea.style.resize = 'none';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.fontSize = '12px';
    textArea.style.fontFamily = 'inherit';
    textArea.style.background = 'transparent';
    textArea.style.cursor = 'text';

    textArea.addEventListener('mousedown', (e) => e.stopPropagation());

    textArea.addEventListener('input', (e) => {
      this.content = e.target.value;
    });

    textArea.addEventListener('blur', () => {
      if (onBlur) onBlur(this);
    });

    div.append(divTitle, textArea);

    // Fix textarea height after h4 is in DOM
    setTimeout(() => {
      textArea.style.maxHeight = `calc(100% - ${divTitle.offsetHeight + padding}px)`;
    });

    return div;
  }
}
