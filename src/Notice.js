import { createElement } from './utils/createElement.js';

const COLORS = ['#fff9c4', '#c8e6c9', '#bbdefb', '#f8bbd0', '#ffe0b2', '#ffffff'];

export class Notice {
  constructor(data = {}, onRemove, onUpdate) {
    this.id = data.id || Date.now().toString();
    this.title = data.title || '';
    this.top = data.top ?? 80;
    this.left = data.left ?? 20;
    this.content = data.content || '';
    this.color = data.color || '#fff9c4';
    this.htmlElement = this.#getElement(onRemove, onUpdate);
  }

  updatePosition(left, top) {
    this.left = left;
    this.top = top;
    this.htmlElement.style.left = `${left}px`;
    this.htmlElement.style.top = `${top}px`;
  }

  matches(query) {
    if (!query) return true;
    const q = query.toLowerCase();
    return this.title.toLowerCase().includes(q) || this.content.toLowerCase().includes(q);
  }

  #getElement(onRemove, onUpdate) {
    const padding = 10;

    const div = createElement('div');
    div.style.width = '200px';
    div.style.border = '1px solid rgba(0,0,0,0.12)';
    div.style.borderRadius = '14px';
    div.style.position = 'absolute';
    div.style.top = `${this.top}px`;
    div.style.left = `${this.left}px`;
    div.style.background = this.color;
    div.style.zIndex = 0;
    div.style.padding = `${padding}px`;
    div.style.boxSizing = 'border-box';
    div.style.cursor = 'grab';
    div.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '8px';

    const divTitle = createElement('div');
    divTitle.style.display = 'flex';
    divTitle.style.alignItems = 'center';
    divTitle.style.gap = '4px';

    const titleInput = createElement('input');
    titleInput.type = 'text';
    titleInput.value = this.title;
    titleInput.placeholder = 'Название...';
    titleInput.style.flexGrow = '1';
    titleInput.style.minWidth = '0';
    titleInput.style.border = 'none';
    titleInput.style.outline = 'none';
    titleInput.style.background = 'transparent';
    titleInput.style.fontSize = '13px';
    titleInput.style.fontWeight = 'bold';
    titleInput.style.fontFamily = 'inherit';
    titleInput.style.cursor = 'text';

    titleInput.addEventListener('mousedown', (e) => e.stopPropagation());
    titleInput.addEventListener('input', (e) => { this.title = e.target.value; });
    titleInput.addEventListener('blur', () => { if (onUpdate) onUpdate(this); });

    const rmBtn = createElement('button');
    rmBtn.textContent = '×';
    rmBtn.style.flexShrink = '0';
    rmBtn.style.padding = '0 4px';
    rmBtn.style.cursor = 'pointer';
    rmBtn.style.border = 'none';
    rmBtn.style.background = 'transparent';
    rmBtn.style.fontSize = '18px';
    rmBtn.style.lineHeight = '1';
    rmBtn.style.color = '#666';

    rmBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    rmBtn.addEventListener('click', () => {
      div.classList.remove('note-enter');
      div.classList.add('note-exit');
      div.addEventListener('animationend', () => {
        div.remove();
        if (onRemove) onRemove(this.id);
      }, { once: true });
    }, { once: true });

    divTitle.append(titleInput, rmBtn);

    const colorRow = createElement('div');
    colorRow.style.display = 'flex';
    colorRow.style.gap = '5px';
    colorRow.style.alignItems = 'center';

    COLORS.forEach((c) => {
      const swatch = createElement('button');
      swatch.style.width = '18px';
      swatch.style.height = '18px';
      swatch.style.borderRadius = '50%';
      swatch.style.background = c;
      swatch.style.border = this.color === c ? '2px solid #444' : '1px solid #bbb';
      swatch.style.cursor = 'pointer';
      swatch.style.padding = '0';
      swatch.style.flexShrink = '0';

      swatch.addEventListener('mousedown', (e) => e.stopPropagation());
      swatch.addEventListener('click', () => {
        this.color = c;
        div.style.background = c;
        colorRow.querySelectorAll('button').forEach((s) => {
          s.style.border = '1px solid #bbb';
        });
        swatch.style.border = '2px solid #444';
        if (onUpdate) onUpdate(this);
      });

      colorRow.append(swatch);
    });

    const textArea = createElement('textarea');
    textArea.value = this.content;
    textArea.placeholder = 'Описание...';
    textArea.style.width = '100%';
    textArea.style.minHeight = '120px';
    textArea.style.resize = 'vertical';
    textArea.style.border = '1px solid rgba(0,0,0,0.15)';
    textArea.style.borderRadius = '8px';
    textArea.style.outline = 'none';
    textArea.style.padding = '7px';
    textArea.style.fontSize = '12px';
    textArea.style.fontFamily = 'inherit';
    textArea.style.background = 'rgba(255,255,255,0.5)';
    textArea.style.cursor = 'text';
    textArea.style.boxSizing = 'border-box';
    textArea.style.lineHeight = '1.5';

    textArea.addEventListener('mousedown', (e) => e.stopPropagation());
    textArea.addEventListener('input', (e) => { this.content = e.target.value; });
    textArea.addEventListener('blur', () => { if (onUpdate) onUpdate(this); });

    div.append(divTitle, colorRow, textArea);
    div.classList.add('note-enter');

    return div;
  }
}
