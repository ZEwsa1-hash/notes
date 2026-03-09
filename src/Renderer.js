export class Renderer {
  add(notice) {
    document.body.append(notice.htmlElement);
  }
}
