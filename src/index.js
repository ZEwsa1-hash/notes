import { Notice } from './Notice.js';
import { Store } from './Store.js';
import { Renderer } from './Renderer.js';
import { applyDragAndDrop } from './DragAndDrop.js';

const store = new Store();
const renderer = new Renderer();

function createNotice(data = {}) {
  const notice = new Notice(
    data,
    (id) => store.remove(id),
    (n) => store.update(n)
  );

  applyDragAndDrop(notice.htmlElement, ({ left, top }) => {
    notice.updatePosition(left, top);
    store.update(notice);
  });

  renderer.add(notice);
  return notice;
}

// Load saved notices
store.load().forEach((data) => createNotice(data));

// "+" button
const addBtn = document.createElement('button');
addBtn.textContent = '+';
addBtn.style.position = 'fixed';
addBtn.style.bottom = '20px';
addBtn.style.right = '20px';
addBtn.style.width = '48px';
addBtn.style.height = '48px';
addBtn.style.borderRadius = '50%';
addBtn.style.border = 'none';
addBtn.style.background = '#333';
addBtn.style.color = '#fff';
addBtn.style.fontSize = '24px';
addBtn.style.cursor = 'pointer';
addBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

addBtn.addEventListener('click', () => {
  const title = prompt('Note title:');
  if (title === null) return;
  const notice = createNotice({ title });
  store.add(notice);
});

document.body.append(addBtn);
