import { Notice } from './Notice.js';
import { Store } from './Store.js';
import { Renderer } from './Renderer.js';
import { applyDragAndDrop } from './DragAndDrop.js';

const store = new Store();
const renderer = new Renderer();
const allNotices = [];

const NOTE_WIDTH = 200;
const NOTE_GAP = 16;
const NOTE_START_X = 20;
const NOTE_START_Y = 80;
let newNoteIndex = 0;

function getNextPosition() {
  const perRow = Math.max(1, Math.floor((window.innerWidth - NOTE_START_X) / (NOTE_WIDTH + NOTE_GAP)));
  const col = newNoteIndex % perRow;
  const row = Math.floor(newNoteIndex / perRow);
  newNoteIndex++;
  return {
    left: NOTE_START_X + col * (NOTE_WIDTH + NOTE_GAP),
    top: NOTE_START_Y + row * (240 + NOTE_GAP),
  };
}

function createNotice(data = {}) {
  const notice = new Notice(
    data,
    (id) => {
      store.remove(id);
      const idx = allNotices.findIndex((n) => n.id === id);
      if (idx !== -1) allNotices.splice(idx, 1);
    },
    (n) => store.update(n)
  );

  applyDragAndDrop(notice.htmlElement, ({ left, top }) => {
    notice.updatePosition(left, top);
    store.update(notice);
  });

  allNotices.push(notice);
  renderer.add(notice);
  return notice;
}

store.load().forEach((data) => createNotice(data));

const searchBar = document.createElement('input');
searchBar.type = 'text';
searchBar.placeholder = 'Поиск по заметкам...';
Object.assign(searchBar.style, {
  position: 'fixed',
  top: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
  padding: '9px 18px',
  borderRadius: '24px',
  border: '1px solid #ccc',
  fontSize: '14px',
  outline: 'none',
  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
  zIndex: '1000',
  background: '#fff',
});

searchBar.addEventListener('input', () => {
  const query = searchBar.value;
  allNotices.forEach((n) => {
    n.htmlElement.style.display = n.matches(query) ? '' : 'none';
  });
});

document.body.append(searchBar);

const btnGroup = document.createElement('div');
Object.assign(btnGroup.style, {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  zIndex: '1000',
});

const clearBtn = document.createElement('button');
clearBtn.textContent = 'Очистить';
Object.assign(clearBtn.style, {
  height: '44px',
  padding: '0 18px',
  borderRadius: '22px',
  border: 'none',
  background: '#e53e3e',
  color: '#fff',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
});

clearBtn.addEventListener('click', () => {
  if (!confirm('Удалить все заметки?')) return;
  allNotices.forEach((n) => {
    const el = n.htmlElement;
    el.classList.remove('note-enter');
    el.classList.add('note-exit');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  });
  allNotices.length = 0;
  newNoteIndex = 0;
  store.clearAll();
});

const addBtn = document.createElement('button');
addBtn.textContent = '+';
Object.assign(addBtn.style, {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  border: 'none',
  background: '#333',
  color: '#fff',
  fontSize: '24px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
});

addBtn.addEventListener('click', () => {
  const pos = getNextPosition();
  const notice = createNotice(pos);
  store.add(notice);
});

btnGroup.append(clearBtn, addBtn);
document.body.append(btnGroup);
