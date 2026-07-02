document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggle-btn');
  if (!btn) return;

  const rubyElements = document.querySelectorAll('RUBY');

  // 1. 依然在網頁載入時，自動幫所有大寫 RUBY 準備好 hover 提示
  rubyElements.forEach(ruby => {
    const coreTextNode = ruby.querySelector('ruby > ruby');
    const rts = ruby.querySelectorAll('rt');
    if (rts.length >= 3) {
      const meaning = rts[0].textContent.trim();
      const lemma = rts[1].textContent.trim();
      const pos = rts[2].textContent.trim();
      ruby.setAttribute('data-hover', `${lemma} [${pos}]\n${meaning}`);
    }
  });

  // 2. 按鈕點擊時，直接把 class 加在全網頁的 body 上
  btn.addEventListener('click', () => {
    const isOneLine = document.body.classList.toggle('one-line-mode');
    btn.textContent = isOneLine ? "切換為：四行對齊模式" : "切換為：一行模式";
    
    rubyElements.forEach(ruby => {
      const link = ruby.querySelector('a') || ruby;
      if (isOneLine) {
        link.setAttribute('title', ruby.getAttribute('data-hover'));
      } else {
        link.removeAttribute('title');
      }
    });
  });
});