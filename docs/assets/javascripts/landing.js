(function () {
  const landing = document.querySelector('.landing[data-stage]');
  if (!landing) return;

  const introOverlay = landing.querySelector('[data-role="intro"]');
  const introTrigger = landing.querySelector('[data-role="intro-trigger"]');
  const introImage = landing.querySelector('[data-role="intro-image"]');
  const introLabelSlot = landing.querySelector('[data-slot="intro-label"]');
  const introHintSlot = landing.querySelector('[data-slot="intro-hint"]');
  const textBlock = landing.querySelector('[data-typewriter]');
  if (!textBlock) return;

  let stageOneText = (textBlock.dataset.stageOne || '').trim();
  let stageTwoText = (textBlock.dataset.stageTwo || '').trim();
  const advanceButton = landing.querySelector('[data-action="advance"]');
  const exploreButton = landing.querySelector('[data-action="explore"]');
  const exploreTarget = document.querySelector('#future-content');
  const docsSection = landing.querySelector('[data-role="docs"]');
  const overlay = landing.querySelector('.landing__overlay');
  const docsNavButtons = docsSection
    ? Array.from(docsSection.querySelectorAll('[data-docs-target]'))
    : [];
  const docsPanels = docsSection
    ? Array.from(docsSection.querySelectorAll('[data-docs-panel]'))
    : [];
  const glitchLayer = landing.querySelector('[data-role="glitch"]');
  const bgm = landing.querySelector('[data-role="bgm"]');
  const headerFrame = landing.querySelector('[data-header]');
  const headerSlot = landing.querySelector('[data-slot="header"]');
  const primaryBackdrop = landing.querySelector('.landing__background--primary img');
  const secondaryBackdrop = landing.querySelector('.landing__background--secondary img');
  const configUrl = landing.dataset.config;
  const landingCacheKey = landing.dataset.cacheBuster || landing.dataset.cache || '';
  if (landingCacheKey) {
    landing.dataset.cacheBuster = landingCacheKey;
  }

  applyCacheBusterToBackdrop(primaryBackdrop);
  applyCacheBusterToBackdrop(secondaryBackdrop);
  applyCacheBusterToBackdrop(introImage);

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

  function withCacheBuster(url, cacheKey) {
    if (!url) return url;
    const key = cacheKey ? String(cacheKey).trim() : '';
    if (!key) return url;

    const hasQuery = url.includes('?');
    const separator = hasQuery ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(key)}`;
  }

  function applyCacheBusterToBackdrop(imageElement) {
    if (!imageElement) return;

    const cacheKey = landing.dataset.cacheBuster;
    if (!cacheKey) return;

    const defaultSrc =
      imageElement.dataset.originalSrc ||
      imageElement.getAttribute('data-default-src') ||
      imageElement.getAttribute('src');

    if (!defaultSrc) return;

    const resolved = resolveAssetPath(defaultSrc);
    imageElement.dataset.originalSrc = resolved;
    const cached = withCacheBuster(resolved, cacheKey);
    if (cached && imageElement.src !== cached) {
      imageElement.src = cached;
    }
  }

  function setButtonLabel(button, label) {
    if (!button || typeof label !== 'string') return;
    const trimmed = label.trim();
    if (!trimmed) return;
    button.textContent = trimmed;
  }

  function setSlotText(slot, value) {
    if (!slot || typeof value !== 'string') return;
    const trimmed = value.trim();
    if (!trimmed) return;
    slot.textContent = trimmed;
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

    const cacheKey =
      (typeof config.cacheBuster === 'string' && config.cacheBuster.trim()) ||
      (typeof config.cacheBuster === 'number' ? String(config.cacheBuster) : '') ||
      landingCacheKey;

    if (cacheKey) {
      landing.dataset.cacheBuster = cacheKey;
      applyCacheBusterToBackdrop(primaryBackdrop);
      applyCacheBusterToBackdrop(secondaryBackdrop);
      applyCacheBusterToBackdrop(introImage);
    }

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

    if (config.intro && typeof config.intro === 'object') {
      if (config.intro.label) {
        setSlotText(introLabelSlot, config.intro.label);
      }
      if (config.intro.hint) {
        setSlotText(introHintSlot, config.intro.hint);
      }
      if (config.intro.image && introImage) {
        const resolvedIntroImage = resolveAssetPath(config.intro.image);
        introImage.dataset.originalSrc = resolvedIntroImage;
        introImage.src = withCacheBuster(resolvedIntroImage, landing.dataset.cacheBuster);
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
        primaryBackdrop.dataset.originalSrc = resolvedImage;
        primaryBackdrop.src = withCacheBuster(resolvedImage, landing.dataset.cacheBuster);
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
        secondaryBackdrop.dataset.originalSrc = resolvedImage;
        secondaryBackdrop.src = withCacheBuster(resolvedImage, landing.dataset.cacheBuster);
      }
    }

    if (config.audio && bgm) {
      if (typeof config.audio.volume === 'number') {
        bgm.dataset.volume = String(config.audio.volume);
      }
      if (config.audio.src) {
        const resolvedAudio = resolveAssetPath(config.audio.src);
        const cachedAudio = withCacheBuster(resolvedAudio, landing.dataset.cacheBuster);
        bgm.dataset.src = resolvedAudio;
        bgm.dataset.cachedSrc = cachedAudio;
        bgm.setAttribute('src', cachedAudio);
      }
      if (typeof config.audio.autoplay === 'boolean') {
        bgm.dataset.autoplay = String(config.audio.autoplay);
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

    const rawSrc = bgm.dataset.src || bgm.dataset.cachedSrc || bgm.getAttribute('src');
    const resolvedSrc = resolveAssetPath(rawSrc);

    if (resolvedSrc) {
      const cachedSrc = withCacheBuster(resolvedSrc, landing.dataset.cacheBuster);
      if (bgm.dataset.cachedSrc !== cachedSrc) {
        bgm.dataset.cachedSrc = cachedSrc;
      }
      if (bgm.src !== cachedSrc) {
        bgm.src = cachedSrc;
      }
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
          landing.removeEventListener('pointerdown', handlePointerUnlock);
          landing.removeEventListener('pointerup', handlePointerUnlock);
          landing.removeEventListener('touchstart', handlePointerUnlock);
          landing.removeEventListener('keydown', handlePointerUnlock);
          landing.removeEventListener('click', handlePointerUnlock);
        })
        .catch(() => {
          /* Игнорируем ограничения автозапуска. */
        });
    } else {
      isBgmActive = true;
      landing.removeEventListener('pointerdown', handlePointerUnlock);
      landing.removeEventListener('pointerup', handlePointerUnlock);
      landing.removeEventListener('touchstart', handlePointerUnlock);
      landing.removeEventListener('keydown', handlePointerUnlock);
      landing.removeEventListener('click', handlePointerUnlock);
    }
  }

  function handlePointerUnlock(event) {
    const currentStage = landing.getAttribute('data-stage');
    const isIntroTriggerEvent =
      event &&
      event.target &&
      typeof event.target.closest === 'function' &&
      event.target.closest('[data-role="intro-trigger"]');

    if (
      currentStage === 'intro' &&
      !isIntroTriggerEvent
    ) {
      return;
    }

    if (event && event.type === 'keydown') {
      const interactiveKeys = ['Enter', ' ', 'Spacebar'];
      if (!interactiveKeys.includes(event.key)) {
        return;
      }
    }
    startBgm();
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

  function normalizeDocsId(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
  }

  function setActiveDocsPanel(targetId) {
    if (!docsSection) return;

    const normalized = normalizeDocsId(targetId);
    let resolvedId = normalized;

    if (!resolvedId) {
      const fallbackButton = docsNavButtons.find((button) => button.classList.contains('is-active')) || docsNavButtons[0];
      resolvedId = fallbackButton ? normalizeDocsId(fallbackButton.dataset.docsTarget) : '';
    }

    docsNavButtons.forEach((button) => {
      const id = normalizeDocsId(button.dataset.docsTarget);
      const isActive = id === resolvedId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    docsPanels.forEach((panel) => {
      const id = normalizeDocsId(panel.dataset.docsPanel);
      const isActive = id === resolvedId;
      panel.classList.toggle('is-active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  function prepareDocs() {
    if (!docsSection) return;

    setActiveDocsPanel();

    docsNavButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.docsTarget;
        setActiveDocsPanel(target);
      });
    });
  }

  function triggerGlitchTransition() {
    const duration = 900;

    return new Promise((resolve) => {
      if (!glitchLayer) {
        window.setTimeout(resolve, 200);
        return;
      }

      glitchLayer.classList.remove('is-active');
      void glitchLayer.offsetWidth;
      glitchLayer.classList.add('is-active');

      window.setTimeout(() => {
        glitchLayer.classList.remove('is-active');
        resolve();
      }, duration);
    });
  }

  function showDocsSection() {
    if (!docsSection) return;
    docsSection.hidden = false;
    docsSection.classList.add('is-visible');
    docsSection.removeAttribute('aria-hidden');
    window.requestAnimationFrame(() => {
      docsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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

  if (exploreButton) {
    exploreButton.addEventListener('click', () => {
      if (exploreButton.disabled) return;

      if (docsSection) {
        exploreButton.classList.add('is-hidden');
        exploreButton.setAttribute('disabled', 'disabled');
        landing.setAttribute('data-stage', 'transition');

        triggerGlitchTransition().then(() => {
          if (overlay) {
            overlay.classList.add('is-dismissed');
          }

          landing.setAttribute('data-stage', 'docs');
          showDocsSection();
          setActiveDocsPanel('synopsis');
        });
      } else if (exploreTarget) {
        exploreButton.classList.add('is-hidden');
        exploreButton.setAttribute('disabled', 'disabled');
        exploreTarget.hidden = false;
        exploreTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      startBgm();
    });
  }

  if (bgm) {
    landing.addEventListener('pointerdown', handlePointerUnlock);
    landing.addEventListener('pointerup', handlePointerUnlock);
    landing.addEventListener('touchstart', handlePointerUnlock, { passive: true });
    landing.addEventListener('keydown', handlePointerUnlock);
    landing.addEventListener('click', handlePointerUnlock);

    bgm.addEventListener('error', () => {
      isBgmActive = false;
    });
  }

  function setupIntro() {
    if (!introOverlay || !introTrigger) {
      if (!landing.dataset.stage || landing.dataset.stage === 'intro') {
        landing.setAttribute('data-stage', 'one');
      }
      return Promise.resolve();
    }

    landing.setAttribute('data-stage', 'intro');

    return new Promise((resolve) => {
      let isActivated = false;
      let activationTimer = null;

      const finalize = () => {
        if (activationTimer) {
          window.clearTimeout(activationTimer);
        }
        landing.setAttribute('data-stage', 'one');
        resolve();
      };

      const triggerActivation = (event) => {
        if (isActivated) return;
        isActivated = true;
        if (event) {
          event.preventDefault();
        }
        introTrigger.classList.add('is-armed');
        if (typeof introTrigger.blur === 'function') {
          introTrigger.blur();
        }
        landing.setAttribute('data-stage', 'intro-transition');
        startBgm();

        activationTimer = window.setTimeout(finalize, 3000);

        introTrigger.removeEventListener('click', triggerActivation);
        introTrigger.removeEventListener('keydown', handleKeyActivation);
      };

      const handleKeyActivation = (event) => {
        const interactiveKeys = ['Enter', ' ', 'Spacebar'];
        if (!interactiveKeys.includes(event.key)) {
          return;
        }
        triggerActivation(event);
      };

      introTrigger.addEventListener('click', triggerActivation);
      introTrigger.addEventListener('keydown', handleKeyActivation);
    });
  }

  const introReady = setupIntro();

  prepareDocs();

  const configPromise = configUrl ? fetchConfig(configUrl).then(applyConfig).catch(() => {}) : Promise.resolve();

  configPromise.finally(() => {
    if (bgm) {
      setupBgm();
      if (bgm.dataset.autoplay === 'true' && landing.getAttribute('data-stage') !== 'intro') {
        startBgm();
      }
    }
    introReady.then(() => {
      if (bgm && bgm.dataset.autoplay === 'true' && !isBgmActive) {
        startBgm();
      }
      initialize();
    });
  });
})();
