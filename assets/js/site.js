/* 内容请编辑 sections/ 下的独立文件。 */
(() => {
  'use strict';
  const slots = [...document.querySelectorAll('[data-include]')];
  function followHash() {
    if (!location.hash) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
  async function load(slot) {
    slot.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(new URL(slot.dataset.include, document.baseURI), { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      slot.innerHTML = await response.text();
      slot.removeAttribute('aria-busy');
      return true;
    } catch (error) {
      slot.removeAttribute('aria-busy');
      const box = document.createElement('div');
      box.className = 'load-error'; box.setAttribute('role', 'alert');
      const message = document.createElement('p');
      message.textContent = location.protocol === 'file:'
        ? '请通过 GitHub Pages 或本地 HTTP 服务打开本版本；直接双击 HTML 时浏览器可能禁止读取独立栏目文件。'
        : `栏目加载失败：${slot.dataset.include}。请检查该文件是否已上传，或稍后重试。`;
      const retry = document.createElement('button');
      retry.type = 'button'; retry.textContent = '重试';
      retry.addEventListener('click', async () => { if (await load(slot)) followHash(); });
      box.append(message, retry); slot.replaceChildren(box);
      console.warn('Section load failed:', slot.dataset.include, error);
      return false;
    }
  }
  Promise.all(slots.map(load)).then(followHash);
  window.addEventListener('hashchange', followHash);
})();
