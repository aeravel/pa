(function () {
  const landing = document.querySelector('.landing[data-stage]');
  if (!landing) return;

  const textBlock = landing.querySelector('[data-typewriter]');
  if (!textBlock) return;

  const stageOneText = (textBlock.dataset.stageOne || '').trim();
  const stageTwoText = (textBlock.dataset.stageTwo || '').trim();
  const advanceButton = landing.querySelector('[data-action="advance"]');
  const exploreButton = landing.querySelector('[data-action="explore"]');
  const exploreTarget = document.querySelector('#future-content');
  const bgm = landing.querySelector('[data-role="bgm"]');

  if (!stageOneText) return;

  let textNode;
  let cursorNode;
  let typingTimer = null;
  let isStageTwoStarted = false;
  let isBgmActive = false;

  const baseDelay = 34;
  const punctuationDelay = 200;
  const longPauseDelay = 380;

  function resolveAssetPath(path) {
    if (!path) return '';
    try {
      return new URL(path, document.baseURI).toString();
    } catch (error) {
      return path;
    }
  }

  function setupBgm() {
    if (!bgm) return;

    if (bgm.dataset.volume) {
      const volume = parseFloat(bgm.dataset.volume);
      if (!Number.isNaN(volume)) {
        bgm.volume = Math.min(1, Math.max(0, volume));
      }
    }

    const rawSrc = bgm.dataset.src || bgm.getAttribute('src');
    const resolvedSrc = resolveAssetPath(rawSrc);

    if (resolvedSrc && bgm.src !== resolvedSrc) {
      bgm.src = resolvedSrc;
    }

    if (bgm.readyState === 0) {
      try {
        bgm.load();
      } catch (error) {
        /* Ничего страшного, если браузер запретит повторную загрузку. */
      }
    }
  }

  function startBgm() {
    if (!bgm || isBgmActive || !bgm.src) return;

    const playAttempt = bgm.play();
    if (playAttempt && typeof playAttempt.then === 'function') {
      playAttempt
        .then(() => {
          isBgmActive = true;
        })
        .catch(() => {
          /* Игнорируем ограничения автозапуска. */
        });
    } else {
      isBgmActive = true;
    }
  }

  function prepareBlock() {
    if (typingTimer) {
      window.clearTimeout(typingTimer);
      typingTimer = null;
    }

    textBlock.innerHTML = '';
    textNode = document.createTextNode('');
    cursorNode = document.createElement('span');
    cursorNode.className = 'vn-block__cursor';
    cursorNode.setAttribute('aria-hidden', 'true');
    textBlock.append(textNode, cursorNode);
  }

  function getDelayForCharacter(char) {
    if (!char) return baseDelay;

    if ('.,!?…:;'.includes(char)) {
      return punctuationDelay;
    }

    if (char === '\u2014' || char === '\u2013') {
      return longPauseDelay;
    }

    return baseDelay;
  }

  function typeText(fullText, resolve) {
    const length = fullText.length;
    let index = 0;

    const step = () => {
      const nextIndex = index + 1;
      textNode.textContent = fullText.slice(0, nextIndex);
      index = nextIndex;

      if (index >= length) {
        cursorNode.remove();
        resolve();
        return;
      }

      const delay = getDelayForCharacter(fullText[index - 1]);
      typingTimer = window.setTimeout(step, delay);
    };

    step();
  }

  function playStage(text, buttonToShow) {
    prepareBlock();

    if (buttonToShow) {
      buttonToShow.classList.add('is-hidden');
    }

    return new Promise((resolve) => {
      typeText(text, () => {
        if (buttonToShow) {
          window.requestAnimationFrame(() => {
            buttonToShow.classList.remove('is-hidden');
          });
        }
        resolve();
      });
    });
  }

  function startStageTwo() {
    if (isStageTwoStarted || !stageTwoText) return;
    isStageTwoStarted = true;
    landing.setAttribute('data-stage', 'two');
    playStage(stageTwoText, exploreButton);
  }

  if (advanceButton) {
    advanceButton.addEventListener('click', () => {
      advanceButton.classList.add('is-hidden');
      startStageTwo();
      startBgm();
    });
  }

  if (exploreButton && exploreTarget) {
    exploreButton.addEventListener('click', () => {
      exploreTarget.hidden = false;
      exploreTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      startBgm();
    });
  }

  if (bgm) {
    setupBgm();

    const unlockEvents = [
      { name: 'pointerdown', options: { once: true } },
      { name: 'pointerup', options: { once: true } },
      { name: 'touchstart', options: { once: true, passive: true } },
      { name: 'keydown', options: { once: true } }
    ];

    unlockEvents.forEach(({ name, options }) => {
      landing.addEventListener(
        name,
        () => {
          startBgm();
        },
        options
      );
    });
  }

  playStage(stageOneText, advanceButton);
})();
