import { LocalStorageService } from './services/LocalStorage.js';

export class Store {
  #notices = {};
  #storage;

  constructor() {
    this.#storage = new LocalStorageService('notes');
  }

  load() {
    const saved = this.#storage.get();
    saved.forEach((data) => {
      this.#notices[data.id] = data;
    });
    return saved;
  }

  add(notice) {
    this.#notices[notice.id] = this.#serialize(notice);
    this.#sync();
  }

  update(notice) {
    if (!this.#notices[notice.id]) return;
    this.#notices[notice.id] = this.#serialize(notice);
    this.#sync();
  }

  remove(id) {
    delete this.#notices[id];
    this.#sync();
  }

  clearAll() {
    this.#notices = {};
    this.#sync();
  }

  #serialize(notice) {
    return {
      id: notice.id,
      title: notice.title,
      top: notice.top,
      left: notice.left,
      content: notice.content,
      color: notice.color,
    };
  }

  #sync() {
    this.#storage.set(Object.values(this.#notices));
  }
}
