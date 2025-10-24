(function () {
  const landing = document.querySelector('.landing[data-stage]');
  if (!landing) return;

  const textBlock = landing.querySelector('[data-typewriter]');
  if (!textBlock) return;

  let stageOneText = (textBlock.dataset.stageOne || '').trim();
  let stageTwoText = (textBlock.dataset.stageTwo || '').trim();
  const advanceButton = landing.querySelector('[data-action="advance"]');
  const exploreButton = landing.querySelector('[data-action="explore"]');
  const exploreTarget = document.querySelector('#future-content');
  const bgm = landing.querySelector('[data-role="bgm"]');
  const headerFrame = landing.querySelector('[data-header]');
  const headerSlot = landing.querySelector('[data-slot="header"]');
  const primaryBackdrop = landing.querySelector('.landing__background--primary img');
  const secondaryBackdrop = landing.querySelector('.landing__background--secondary img');
  const configUrl = landing.dataset.config;

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

  function setButtonLabel(button, label) {
    if (!button || typeof label !== 'string') return;
    const trimmed = label.trim();
    if (!trimmed) return;
    button.textContent = trimmed;
  }

  function applyHeader(value) {
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (!trimmed) return;
    if (headerSlot) {
      headerSlot.textContent = trimmed;
    }
    if (headerFrame) {
      headerFrame.setAttribute('data-header', trimmed);
    }
  }

  function applyConfig(config) {
    if (!config || typeof config !== 'object') return;

    if (config.header) {
      applyHeader(config.header);
    }

    if (config.buttons && typeof config.buttons === 'object') {
      if (config.buttons.advance && advanceButton) {
        setButtonLabel(advanceButton, config.buttons.advance);
      }
      if (config.buttons.explore && exploreButton) {
        setButtonLabel(exploreButton, config.buttons.explore);
      }
    }

    const stages = Array.isArray(config.stages) ? config.stages : [];
    const stageById = new Map();
    stages.forEach((stage) => {
      if (!stage || typeof stage !== 'object') return;
      const identifiers = [stage.id, stage.stage, stage.name];
      identifiers
        .map((value) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
        .filter(Boolean)
        .forEach((key) => {
          if (!stageById.has(key)) {
            stageById.set(key, stage);
          }
        });
    });

    const fallbackStage = stages[0] && typeof stages[0] === 'object' ? stages[0] : null;
    const fallbackSecondStage = stages[1] && typeof stages[1] === 'object' ? stages[1] : null;

    const stageOneConfig = stageById.get('one') || stageById.get('1') || fallbackStage;
    const stageTwoConfig = stageById.get('two') || stageById.get('2') || fallbackSecondStage;

    if (stageOneConfig) {
      if (typeof stageOneConfig.text === 'string') {
        stageOneText = stageOneConfig.text.trim();
        textBlock.dataset.stageOne = stageOneText;
      }
      const stageOneImage = stageOneConfig.image || stageOneConfig.backdrop;
      if (stageOneImage && primaryBackdrop) {
        const resolvedImage = resolveAssetPath(stageOneImage);
        primaryBackdrop.src = resolvedImage;
      }
    }

    if (stageTwoConfig) {
      if (typeof stageTwoConfig.text === 'string') {
        stageTwoText = stageTwoConfig.text.trim();
        textBlock.dataset.stageTwo = stageTwoText;
      }
      const stageTwoImage = stageTwoConfig.image || stageTwoConfig.backdrop;
      if (stageTwoImage && secondaryBackdrop) {
        const resolvedImage = resolveAssetPath(stageTwoImage);
        secondaryBackdrop.src = resolvedImage;
      }
    }

    if (config.audio && bgm) {
      if (typeof config.audio.volume === 'number') {
        bgm.dataset.volume = String(config.audio.volume);
      }
      if (config.audio.src) {
        const resolvedAudio = resolveAssetPath(config.audio.src);
        bgm.dataset.src = resolvedAudio;
        bgm.setAttribute('src', resolvedAudio);
      }
      setupBgm();
    }
  }

  function fetchConfig(url) {
    if (!url || typeof window.fetch !== 'function') {
      return Promise.reject(new Error('no-fetch'));
    }

    const resolvedUrl = resolveAssetPath(url);

    return window
      .fetch(resolvedUrl, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status}`);
        }
        return response.json();
      });
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

  function initialize() {
    playStage(stageOneText, advanceButton);
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

  const configPromise = configUrl ? fetchConfig(configUrl).then(applyConfig).catch(() => {}) : Promise.resolve();

  configPromise.finally(() => {
    if (bgm) {
      setupBgm();
    }
    initialize();
  });
})();
