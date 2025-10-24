---
title: RSC — начало истории
---

<div class="landing" data-stage="one" data-config="assets/data/landing.json" data-cache-buster="1">
  <div class="landing__background landing__background--primary" aria-hidden="true">
    <img src="assets/images/landing-stage-one.svg" alt="" loading="eager" data-default-src="assets/images/landing-stage-one.svg" />
  </div>
  <div class="landing__background landing__background--secondary" aria-hidden="true">
    <img src="assets/images/landing-stage-two.svg" alt="" loading="lazy" data-default-src="assets/images/landing-stage-two.svg" />
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
        data-stage-two='RSC — очень жёсткая структура. Даже при почти утопичных реалиях обучение в академии RSC — отдельная история: туда идут вместо обычных школ и учатся годами, больше десятка лет; услуга эта, говорят, безумно дорогая, а точной цены никто не называет — вокруг лишь слухи и догадки. В обычных школах дают элитное образование, а академия RSC существует исключительно для подготовки будущих агентов RSC; по слухам, там взращивают «сверх‑людей», сильных во всём — от физической подготовки до интеллекта. Это стоит огромных денег даже по меркам околоутопии. Однако есть и второй путь: редкие приглашения тем, кто отличился в полиции или спецслужбах. Ты — как раз из таких. Твой успех открыл тебе дверь в RSC.'
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
</div>

<section id="future-content" hidden>
  <h2>Следующий шаг</h2>
  <p>
    Здесь появятся дополнительные сведения об академии RSC, героях и миссиях. Кнопка «Я хочу знать больше»
    плавно пролистает к этому блоку, как только он будет заполнен.
  </p>
</section>
