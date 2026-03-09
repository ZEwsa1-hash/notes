export class LocalStorageService {
  constructor(key) {
    this.key = key;
  }

  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get() {
    const result = localStorage.getItem(this.key);
    if (result === null) return [];
    try {
      return JSON.parse(result);
    } catch {
      return [];
    }
  }
}
