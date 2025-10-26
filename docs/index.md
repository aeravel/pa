---
title: RSC — начало истории
---

<div class="landing" data-stage="intro" data-config="assets/data/landing.json" data-cache-buster="1">
  <div class="landing__intro" data-role="intro">
    <button
      type="button"
      class="landing__intro-trigger"
      data-role="intro-trigger"
      aria-label="Запустить проигрыватель"
    >
      <span class="landing__intro-figure">
        <img
          src="assets/images/landing-intro-vinyl.svg"
          data-role="intro-image"
          data-default-src="assets/images/landing-intro-vinyl.svg"
          alt="Виниловый проигрыватель на столе"
          loading="eager"
        />
      </span>
      <span class="landing__intro-label" data-slot="intro-label">Включить проигрыватель</span>
      <span class="landing__intro-hint" data-slot="intro-hint">Наведите и нажмите, чтобы музыка зазвучала</span>
    </button>
  </div>
  <div class="landing__background landing__background--primary" aria-hidden="true">
    <img
      src="assets/images/landing-stage-one.svg"
      alt=""
      loading="eager"
      data-default-src="assets/images/landing-stage-one.svg"
    />
  </div>
  <div class="landing__background landing__background--secondary" aria-hidden="true">
    <img
      src="assets/images/landing-stage-two.svg"
      alt=""
      loading="lazy"
      data-default-src="assets/images/landing-stage-two.svg"
    />
  </div>
  <div class="landing__glitch" data-role="glitch" aria-hidden="true">
    <span class="landing__glitch-layer landing__glitch-layer--a"></span>
    <span class="landing__glitch-layer landing__glitch-layer--b"></span>
    <span class="landing__glitch-layer landing__glitch-layer--c"></span>
  </div>
  <audio
    class="landing__bgm"
    data-role="bgm"
    src="assets/audio/landing-theme.mp3"
    data-src="assets/audio/landing-theme.mp3"
    data-volume="0.6"
    loop
    preload="auto"
  ></audio>

  <div class="landing__overlay">
    <div class="vn-frame" data-header="RSC // BRIEFING">
      <span class="vn-frame__header" data-slot="header">RSC // BRIEFING</span>
      <div
        class="vn-frame__body"
        data-typewriter
        data-stage-one='Ты — полицейский в околоутопичном мире ближайшего будущего. Недавно отряд, в котором ты служишь, уничтожил последнюю крупную преступную группировку, и ты сыграл в этом ключевую роль. После этого тебе приходит приглашение в RSC — региональный филиал огромной корпорации по борьбе с преступностью, разделённой на регионы (Азия/Европа/Америка); RSC отвечает за азиатский регион (Корея, Китай, Япония и др.). Крупных мафий, террористических ячеек и синдикатов в принципе не осталось: последнюю ликвидировал отряд, в котором ты служишь. Мелочами занимаются обычные полицейские. Если очаг растёт — подключается RSC.'
        data-stage-two='В этом мире классические госспецслужбы (например, ФСБ, FBI, MI6, DGSI) упразднены; их задачи переданы корпорации. RSC отвечает за азиатский регион (Корея, Китай, Япония и др.) и частично затрагивает Россию. Крупных мафий, террористических ячеек и синдикатов в принципе не осталось: последнюю ликвидировал отряд, в котором ты служишь. Мелочами занимаются обычные полицейские. Если очаг растёт — подключается RSC.'
      ></div>

      <div class="landing__actions">
        <button
          type="button"
          class="landing__button landing__button--primary is-hidden"
          data-action="advance"
          data-default-label="Подробнее об RSC"
        >
          Подробнее об RSC
        </button>
        <button
          type="button"
          class="landing__button landing__button--secondary is-hidden"
          data-action="explore"
          data-default-label="Я хочу знать больше"
        >
          Я хочу знать больше
        </button>
      </div>
    </div>
  </div>

  <section id="future-content" class="landing-docs" data-role="docs" hidden aria-hidden="true">
    <div class="landing-docs__desktop">
      <div class="landing-docs__wallpaper" aria-hidden="true">
        <div class="landing-docs__wallpaper-glow"></div>
      </div>
      <div class="landing-docs__window" role="region" aria-label="Рабочий стол RSC">
        <header class="landing-docs__titlebar">
          <div class="landing-docs__title">
            <span class="landing-docs__title-icon" aria-hidden="true"></span>
            <span class="landing-docs__title-label">RSC // ARCHIVE EXPLORER</span>
          </div>
          <div class="landing-docs__window-controls" aria-hidden="true">
            <span class="landing-docs__window-dot"></span>
            <span class="landing-docs__window-dot"></span>
            <span class="landing-docs__window-dot"></span>
          </div>
        </header>
        <div class="landing-docs__toolbar" role="toolbar" aria-label="Панель управления архивом">
          <div class="landing-docs__toolbar-group landing-docs__toolbar-group--nav">
            <button type="button" class="landing-docs__toolbar-button" disabled>
              <span aria-hidden="true">◀</span>
              <span class="sr-only">Назад</span>
            </button>
            <button type="button" class="landing-docs__toolbar-button" disabled>
              <span aria-hidden="true">▶</span>
              <span class="sr-only">Вперёд</span>
            </button>
            <button type="button" class="landing-docs__toolbar-button" disabled>
              <span aria-hidden="true">⟳</span>
              <span class="sr-only">Обновить</span>
            </button>
          </div>
          <div class="landing-docs__address-bar" role="presentation">
            <span class="landing-docs__address-icon" aria-hidden="true"></span>
            <span class="landing-docs__address-value" data-slot="docs-path" data-root="RSC">RSC ▸ Документация</span>
          </div>
          <label class="landing-docs__search">
            <span class="sr-only">Поиск по архиву</span>
            <input type="search" placeholder="Поиск по архиву" disabled />
          </label>
        </div>
        <div class="landing-docs__frame">
          <aside class="landing-docs__nav" aria-label="Разделы досье RSC">
            <span class="landing-docs__nav-label">Разделы</span>
            <div class="landing-docs__nav-list">
              <button type="button" class="landing-docs__tab is-active" data-docs-target="synopsis" aria-selected="true">
                <span class="landing-docs__tab-icon" aria-hidden="true"></span>
                <span class="landing-docs__tab-label">Синопсис</span>
              </button>
              <button type="button" class="landing-docs__tab" data-docs-target="prologue" aria-selected="false">
                <span class="landing-docs__tab-icon" aria-hidden="true"></span>
                <span class="landing-docs__tab-label">Пролог</span>
              </button>
              <button type="button" class="landing-docs__tab" data-docs-target="world" aria-selected="false">
                <span class="landing-docs__tab-icon" aria-hidden="true"></span>
                <span class="landing-docs__tab-label">Мир</span>
              </button>
              <button type="button" class="landing-docs__tab" data-docs-target="characters" aria-selected="false">
                <span class="landing-docs__tab-icon" aria-hidden="true"></span>
                <span class="landing-docs__tab-label">Персонажи</span>
              </button>
            </div>
          </aside>
          <div class="landing-docs__content" role="presentation">
            <article class="landing-docs__panel is-active" data-docs-panel="synopsis">
              <h2>Синопсис</h2>
              <p>Здесь должен быть синопсис.</p>
            </article>
            <article class="landing-docs__panel" data-docs-panel="prologue" hidden>
              <h2>Пролог</h2>
              <p>Здесь должен быть пролог.</p>
            </article>
            <article class="landing-docs__panel" data-docs-panel="world" hidden>
              <h2>Мир</h2>
              <p>Здесь должно быть описание мира.</p>
            </article>
            <article class="landing-docs__panel" data-docs-panel="characters" hidden>
              <h2>Персонажи</h2>
              <p>Здесь должно быть описание персонажей.</p>
            </article>
          </div>
        </div>
      </div>
      <footer class="landing-docs__taskbar" aria-hidden="true">
        <span class="landing-docs__taskbar-indicator"></span>
        <span class="landing-docs__taskbar-label">RSC DESKTOP · ЗАЩИЩЁННЫЙ КАНАЛ</span>
      </footer>
    </div>
  </section>
</div>
