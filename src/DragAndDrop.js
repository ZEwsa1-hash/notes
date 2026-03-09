export function applyDragAndDrop(lm, onDragEnd) {
  // Prevent drag when interacting with textarea
  lm.querySelector('textarea')?.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });

  lm.addEventListener('mousedown', (event) => {
    lm.style.zIndex = 1000;

    const { x, y } = lm.getBoundingClientRect();
    const offsetX = event.clientX - x;
    const offsetY = event.clientY - y;

    const ac = new AbortController();

    document.addEventListener(
      'mousemove',
      (e) => {
        const left = e.clientX - offsetX;
        const top = e.clientY - offsetY;
        lm.style.left = `${left}px`;
        lm.style.top = `${top}px`;
      },
      { signal: ac.signal }
    );

    document.addEventListener(
      'mouseup',
      () => {
        lm.style.zIndex = 0;
        ac.abort();
        onDragEnd({
          left: parseInt(lm.style.left),
          top: parseInt(lm.style.top),
        });
      },
      { signal: ac.signal }
    );
  });
}
