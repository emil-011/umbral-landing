import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
const staticMode = root.classList.contains('static');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animate = !staticMode && !prefersReduced;

let lenis: Lenis | null = null;
let splitCache: { revert: () => void }[] = [];


const $ = <T extends Element = Element>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector);

const $$ = <T extends Element = Element>(selector: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(selector));

const formatNumber = (value: number, decimals = 0) => {
  const fixed = Math.abs(value).toFixed(decimals);
  const [whole, fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${value < 0 ? '−' : ''}${grouped}${decimals ? `,${fraction}` : ''}`;
};

/* ==========================================================================
   NAVEGACIÓN
   ========================================================================== */

function initNav() {
  const nav = $<HTMLElement>('[data-nav]');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = $$<HTMLAnchorElement>('[data-nav-link]');
  const sections = $$<HTMLElement>('main section[id]');

  if (links.length && sections.length && 'IntersectionObserver' in window) {
    const linkById = new Map<string, HTMLAnchorElement>();
    links.forEach((link) => {
      const id = link.getAttribute('href')?.slice(1);
      if (id) linkById.set(id, link);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          });
          const active = linkById.get(entry.target.id);
          active?.classList.add('is-active');
          active?.setAttribute('aria-current', 'location');
        });
      },
      { rootMargin: '-38% 0px -54% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
  }

  const toggle = $<HTMLButtonElement>('[data-nav-toggle]');
  const menu = $<HTMLElement>('[data-nav-menu]');
  if (!toggle || !menu) return;

  let open = false;

  const setMenu = (next: boolean) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', next ? 'Cerrar menú' : 'Abrir menú');

    if (next) {
      menu.hidden = false;
      if (animate) {
        gsap.fromTo(
          menu,
          { height: 0, opacity: 0, overflow: 'hidden' },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.36,
            ease: 'power3.out',
            onComplete: () => gsap.set(menu, { clearProps: 'height,opacity,overflow' }),
          },
        );
      }
    } else if (animate) {
      gsap.to(menu, {
        height: 0,
        opacity: 0,
        duration: 0.26,
        ease: 'power2.in',
        onComplete: () => {
          menu.hidden = true;
          gsap.set(menu, { clearProps: 'height,opacity,overflow' });
        },
      });
    } else {
      menu.hidden = true;
    }
  };

  toggle.addEventListener('click', () => setMenu(!open));

  menu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => setMenu(false)),
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080 && open) setMenu(false);
  });
}

/* ==========================================================================
   PESTAÑAS
   ========================================================================== */

function setupTabs(
  tabs: HTMLButtonElement[],
  panels: HTMLElement[],
  onActivate?: (panel: HTMLElement) => void,
) {
  if (!tabs.length) return;

  const activate = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.classList.toggle('is-active', selected);
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel, i) => {
      const selected = i === index;
      panel.hidden = !selected;
      panel.classList.toggle('is-active', selected);
    });

    if (focus) tabs[index]?.focus();
    if (panels[index]) onActivate?.(panels[index]);
  };

  tabs.forEach((tab, index) => {
    tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;

    tab.addEventListener('click', () => activate(index));

    tab.addEventListener('keydown', (event) => {
      let next = index;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        next = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        next = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        next = 0;
      } else if (event.key === 'End') {
        next = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activate(next, true);
    });
  });
}

function drawPaths(scope: ParentNode = document) {
  $$<SVGPathElement>('[data-draw]', scope).forEach((path) => {
    gsap.fromTo(
      path,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out', overwrite: true },
    );
  });
}

function initFicheCarousel() {
  const root = $<HTMLElement>('[data-fiche-carousel]');
  if (!root) return;

  const viewport = $<HTMLElement>('[data-fiche-viewport]', root);
  const track = $<HTMLElement>('[data-fiche-track]', root);
  const slides = $$<HTMLElement>('[data-fiche-slide]', root);
  const dots = $$<HTMLButtonElement>('[data-fiche-dot]', root);
  const prev = $<HTMLButtonElement>('[data-fiche-prev]', root);
  const next = $<HTMLButtonElement>('[data-fiche-next]', root);
  const progress = $<HTMLElement>('[data-fiche-progress]', root);
  const count = $<HTMLElement>('[data-fiche-count]', root);
  const toggle = $<HTMLButtonElement>('[data-fiche-toggle]', root);

  if (!viewport || !track || !slides.length) return;

  let index = 0;
  let cycle: gsap.core.Timeline | null = null;
  let scope: ScrollTrigger | null = null;
  let manuallyPaused = false;
  let hovering = false;
  const pad = (value: number) => String(value).padStart(2, '0');

  // Alinea el desplazamiento al píxel físico: un transform a medias de píxel
  // deja el texto de la ficha rasterizado y borroso hasta el siguiente repintado.
  const snapToPixel = (value: number) => {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(value * dpr) / dpr;
  };

  // En reposo no dejamos ninguna capa transformada: el navegador puede volver a
  // rasterizar el texto a resolución completa. El transform solo existe mientras
  // dura el desplazamiento.
  const placeAtRest = (offset: number) => {
    track.style.willChange = 'auto';
    track.style.transform = '';
    track.style.left = `${-offset}px`;
  };

  const setPosition = (next: number, animated: boolean) => {
    index = (next + slides.length) % slides.length;
    const slide = slides[index];
    if (!slide) return;

    // Centra la diapositiva activa en el viewport.
    const target = snapToPixel(
      slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2,
    );

    if (animated) {
      // Pasa el desplazamiento actual a transform antes de animar: así el
      // arranque no salta y el reposo puede quedarse sin transform.
      const restLeft = Number.parseFloat(track.style.left) || 0;
      const currentX = Number(gsap.getProperty(track, 'x')) || 0;

      track.style.left = '0px';
      gsap.set(track, { x: restLeft + currentX, force3D: false });
      track.style.willChange = 'transform';

      gsap.to(track, {
        x: -target,
        duration: 0.9,
        ease: 'power3.inOut',
        force3D: false,
        overwrite: true,
        onComplete: () => placeAtRest(target),
      });
    } else {
      gsap.killTweensOf(track);
      placeAtRest(target);
    }

    slides.forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', String(active));
    });
    if (count) count.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;

    if (!animated) return;

    const elements = $$<HTMLElement>('.u-slide-anim', slide);
    gsap.fromTo(
      elements,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.04,
        ease: 'power2.out',
        overwrite: true,
        clearProps: 'transform',
      },
    );
    drawPaths(slide);
  };

  const goTo = (target: number) => {
    setPosition(target, animate);
    if (!cycle) return;
    const shouldPlay = !manuallyPaused && !hovering && Boolean(scope?.isActive);
    cycle.restart();
    if (!shouldPlay) cycle.pause();
  };

  setPosition(0, false);

  // Navegación manual: puntos y flechas. También funciona en modo estático.
  dots.forEach((dot, dotIndex) => dot.addEventListener('click', () => goTo(dotIndex)));
  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));

  if (!animate) return;

  const startCycle = () => {
    if (progress) gsap.set(progress, { scaleX: 0 });

    cycle = gsap.timeline({ repeat: -1, paused: true });
    if (progress) {
      cycle.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 6.8, ease: 'none' }, 0);
    }
    cycle.call(() => setPosition(index + 1, true), [], 6.8);
    cycle.to({}, { duration: 0.9 }, 6.8);

    scope = ScrollTrigger.create({
      trigger: root,
      start: 'top 82%',
      end: 'bottom top',
      onToggle: (self) => {
        if (self.isActive && !manuallyPaused) cycle?.play();
        else cycle?.pause();
      },
    });

    if (scope.isActive) cycle.play();
  };

  startCycle();

  const setPaused = (paused: boolean) => {
    manuallyPaused = paused;
    if (paused) cycle?.pause();
    else if (scope?.isActive) cycle?.play();
    if (!toggle) return;
    toggle.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Reanudar el carrusel' : 'Pausar el carrusel');
  };

  toggle?.addEventListener('click', () => setPaused(!manuallyPaused));

  window.addEventListener('resize', () => setPosition(index, false));

  // Se para mientras se lee y sigue sola al salir, salvo pausa manual.
  root.addEventListener('pointerenter', () => {
    hovering = true;
    if (!manuallyPaused) cycle?.pause();
  });
  root.addEventListener('pointerleave', () => {
    hovering = false;
    if (!manuallyPaused && scope?.isActive) cycle?.play();
  });
}

function animateEco(panel: ParentNode) {
  const eco = $<HTMLElement>('[data-plan-eco]', panel);
  if (!eco) return;

  const target = Number(eco.dataset.planEco);
  if (!Number.isFinite(target)) return;

  const state = { value: 0 };
  gsap.to(state, {
    value: target,
    duration: 1.05,
    ease: 'power2.out',
    overwrite: true,
    onUpdate: () => {
      eco.textContent = String(Math.round(state.value));
    },
  });
}

function initPlanTabs() {
  const tabs = $$<HTMLButtonElement>('[data-plan-tab]');
  const panels = $$<HTMLElement>('[data-plan-panel]');

  setupTabs(tabs, panels, (panel) => {
    if (!animate) return;

    gsap.fromTo(
      $$('.u-zontag', panel),
      { scale: 0.82, opacity: 0.35 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.045, ease: 'back.out(1.8)', overwrite: true },
    );

    gsap.fromTo(
      $$('.u-parsed__chip', panel),
      { y: 6, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out', overwrite: true },
    );

    gsap.fromTo(
      $$('.u-phasebar span', panel),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.75, stagger: 0.06, ease: 'power3.out', overwrite: true },
    );

    animateEco(panel);
  });
}

function initTrackTabs() {
  const tabs = $$<HTMLButtonElement>('[data-track-tab]');
  const panels = $$<HTMLElement>('[data-track-panel]');

  setupTabs(tabs, panels, (panel) => {
    if (!animate) return;

    gsap.fromTo(
      panel,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: true },
    );

    animateMeters(panel);
  });
}

/* ==========================================================================
   MOSTRADORES, BARRAS Y MEDIDORES
   ========================================================================== */

function animateCounters(elements: HTMLElement[]) {
  elements.forEach((element) => {
    const target = Number.parseFloat(element.dataset.count ?? '');
    const decimals = Number(element.dataset.decimals ?? 0);
    if (!Number.isFinite(target)) return;

    const state = { value: 0 };
    element.textContent = formatNumber(0, decimals);

    gsap.to(state, {
      value: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = formatNumber(state.value, decimals);
      },
    });
  });
}

function initCounters() {
  $$<HTMLElement>('[data-count]').forEach((element) => {
    let done = false;

    const run = () => {
      if (done) return;
      done = true;
      animateCounters([element]);
    };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 92%',
      once: true,
      onEnter: run,
    });

    if (element.getBoundingClientRect().top < window.innerHeight) run();
  });
}

function prepareMeters() {
  $$<HTMLElement>('[data-meter]').forEach((meter) => {
    if (!meter.dataset.target) meter.dataset.target = meter.style.width || '0%';
    meter.style.width = '0%';
  });
}

function animateMeters(scope: ParentNode = document) {
  $$<HTMLElement>('[data-meter]', scope).forEach((meter) => {
    const target = meter.dataset.target || meter.style.width;
    gsap.fromTo(
      meter,
      { width: 0 },
      { width: target, duration: 0.95, ease: 'power3.out', overwrite: true },
    );
  });
}

function initMeters() {
  if (!$$('[data-meter]').length) return;

  prepareMeters();
  ScrollTrigger.batch('[data-meter]', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => {
      batch.forEach((meter) => {
        const target = (meter as HTMLElement).dataset.target || '0%';
        gsap.fromTo(
          meter,
          { width: 0 },
          { width: target, duration: 0.95, ease: 'power3.out', overwrite: true },
        );
      });
    },
  });
}

function initBars() {
  const bars = $$<HTMLElement>('[data-bar-y]');
  if (!bars.length) return;

  ScrollTrigger.batch(bars, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { scaleY: 1, duration: 1.1, stagger: 0.06, ease: 'power3.out' }),
  });
}

function initPhaseBars() {
  $$<HTMLElement>('[data-phase-bar]').forEach((bar) => {
    const target = bar.style.width;
    gsap.set(bar, { width: 0 });

    ScrollTrigger.create({
      trigger: bar,
      start: 'top 93%',
      once: true,
      onEnter: () => gsap.to(bar, { width: target, duration: 1.1, ease: 'power3.out' }),
    });
  });
}

function initDraws() {
  $$<SVGPathElement>('[data-draw]').forEach((path) => {
    ScrollTrigger.create({
      trigger: path,
      start: 'top 94%',
      once: true,
      onEnter: () => drawPaths(path.parentElement ?? document),
    });
  });
}

/* ==========================================================================
   HERO
   ========================================================================== */

function initHero() {
  const title = $<HTMLElement>('[data-hero-title]');
  const gauge = $<HTMLElement>('[data-hero-gauge]');
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (title) {
    try {
      const split = SplitText.create(title, {
        type: 'words',
        wordsClass: 'u-word',
        aria: 'auto',
      });
      splitCache.push(split);
      gsap.set(title, { opacity: 1 });
      timeline.from(
        split.words,
        { y: 38, opacity: 0, rotate: 1.5, duration: 1.05, stagger: 0.055, ease: 'power4.out' },
        0,
      );
    } catch {
      gsap.set(title, { opacity: 1 });
      timeline.from(title, { y: 28, opacity: 0, duration: 0.9 }, 0);
    }
  }

  timeline.to(
    '.u-hero [data-reveal]',
    { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' },
    0.18,
  );

  if (gauge) {
    timeline.from(
      gauge,
      { opacity: 0, scale: 0.86, rotate: -7, duration: 1.25, ease: 'power3.out' },
      0.22,
    );
  }

  timeline
    .from(
      '[data-hero-chip]',
      { opacity: 0, y: 18, scale: 0.94, duration: 0.7, stagger: 0.09 },
      0.62,
    )
    .from('.u-hero__discs span', { opacity: 0, y: 12, duration: 0.55, stagger: 0.07 }, 0.74)
    .from('.u-hero__ticker', { opacity: 0, duration: 0.6 }, 0.82);

  // El instrumento se deja sin transform al acabar: el texto del centro queda
  // nítido y el parallax mueve solo el contenedor.
  timeline.eventCallback('onComplete', () => {
    gsap.set('[data-hero-gauge], [data-hero-title] .u-word', {
      clearProps: 'transform,opacity',
    });
  });

  gsap.delayedCall(1.2, initHeroIdle);
}

/* Movimiento continuo del instrumento: las zonas y las tres disciplinas
   recorren su propia circunferencia con stroke-dashoffset (sin transformar el
   grupo, que era lo que sacaba los arcos de su sitio), el núcleo respira y las
   tarjetas flotan. Se pausa al salir de pantalla. */
function initHeroIdle() {
  const period = $<HTMLElement>('.u-hero__period');
  const zoneArcs = $$<SVGCircleElement>('[data-hero-zones] circle');
  const core = $<SVGCircleElement>('[data-hero-core]');
  const chips = $$<HTMLElement>('[data-hero-chip]');
  const arcs = $$<SVGGElement>('[data-hero-arc]');
  const visual = $<HTMLElement>('.u-hero__visual');
  const stage = $<HTMLElement>('.u-hero__stage');

  const tweens: gsap.core.Tween[] = [];

  // El dial de zonas da una vuelta completa muy lenta. Cada segmento se mueve
  // sobre su circunferencia, así que nunca cambia de radio.
  zoneArcs.forEach((zoneArc) => {
    tweens.push(
      gsap.fromTo(
        zoneArc,
        { attr: { 'stroke-dashoffset': 0 } },
        {
          attr: { 'stroke-dashoffset': -100 },
          duration: 150,
          repeat: -1,
          ease: 'none',
          paused: true,
        },
      ),
    );
  });

  // Las tres disciplinas van a distinta velocidad y una en sentido contrario.
  // El patrón de dash se repite cada 100 unidades de pathLength, así que el
  // salto del loop cae exactamente sobre el mismo dibujo.
  arcs.forEach((arc, index) => {
    const circle = $<SVGCircleElement>('circle', arc);
    if (!circle) return;
    const from = Number(circle.getAttribute('stroke-dashoffset') ?? 0);
    const to = index === 1 ? from + 100 : from - 100;
    tweens.push(
      gsap.fromTo(
        circle,
        { attr: { 'stroke-dashoffset': from } },
        {
          attr: { 'stroke-dashoffset': to },
          duration: [44, 62, 80][index] ?? 64,
          repeat: -1,
          ease: 'none',
          paused: true,
        },
      ),
    );
  });

  if (core) {
    tweens.push(
      gsap.to(core, {
        opacity: 0.55,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true,
      }),
    );
  }

  chips.forEach((chip, index) => {
    tweens.push(
      gsap.to(chip, {
        y: index % 2 === 0 ? -8 : 7,
        duration: 3.4 + index * 0.45,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true,
      }),
    );
  });

  if (period) {
    tweens.push(
      gsap.to(period, {
        opacity: 0.45,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true,
      }),
    );
  }

  // Parallax suave del instrumento con el puntero. Solo en dispositivos con
  // ratón y sin mover el texto ni el panel de la semana.
  if (visual && stage && window.matchMedia('(pointer: fine)').matches) {
    const xTo = gsap.quickTo(visual, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(visual, 'y', { duration: 0.7, ease: 'power3' });

    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(dx * 16);
      yTo(dy * 12);
    });

    stage.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  }

  if (!tweens.length) return;

  const hero = $<HTMLElement>('.u-hero');
  if (!hero) {
    tweens.forEach((tween) => tween.play());
    return;
  }

  const scope = ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      tweens.forEach((tween) => (self.isActive ? tween.play() : tween.pause()));
    },
  });

  if (scope.isActive) tweens.forEach((tween) => tween.play());
}

/* ==========================================================================
   REVEALS, TÍTULOS Y DETALLES
   ========================================================================== */

function initReveals() {
  const elements = $$<HTMLElement>('[data-reveal]').filter(
    (element) => !element.closest('.u-hero'),
  );

  if (!elements.length) return;

  ScrollTrigger.batch(elements, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.07,
        ease: 'power3.out',
        overwrite: true,
      }),
  });
}

function initSplits() {
  $$<HTMLElement>('[data-split]').forEach((element) => {
    try {
      const split = SplitText.create(element, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'u-line',
        aria: 'auto',
      });
      splitCache.push(split);
      gsap.set(element, { opacity: 1 });
      gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.95,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    } catch {
      gsap.set(element, { opacity: 1 });
      gsap.from(element, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    }
  });
}

/* ==========================================================================
   MINIATURAS DE ROLES
   Las tres ilustraciones entran al llegar la sección y luego mantienen un idle
   muy corto. Todo son piezas decorativas: nunca se transforma la tarjeta.
   ========================================================================== */

function initRoleArt() {
  const roles = $('#roles');
  if (!roles) return;

  // Las tarjetas ya entran con su propio reveal: aquí solo hay un idle corto
  // por ilustración, para que el conjunto no parezca que arranca dos veces.
  const idle: gsap.core.Timeline[] = [];

  const clubDot = $<HTMLElement>('.u-art--club span:nth-child(2) i');
  if (clubDot) {
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'sine.inOut' },
      paused: true,
      delay: 0.5,
    });

    tl.to(clubDot, { scale: 1.24, duration: 1.4 }, 0).to(clubDot, { scale: 1, duration: 1.4 }, 1.4);
    idle.push(tl);
  }

  const trainerPills = $$<HTMLElement>('.u-art--trainer .u-art__zones i');
  if (trainerPills.length) {
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'sine.inOut' },
      paused: true,
      delay: 0.7,
    });

    trainerPills.forEach((pill, index) => {
      const at = index * 0.2;
      tl.to(pill, { opacity: 0.55, duration: 0.55 }, at).to(
        pill,
        { opacity: 1, duration: 0.55 },
        at + 0.55,
      );
    });

    tl.to({}, { duration: 0.35 });
    idle.push(tl);
  }

  const athleteSignal = $<HTMLElement>('.u-art--athlete .is-signal');
  if (athleteSignal) {
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'sine.inOut' },
      paused: true,
      delay: 0.9,
    });

    tl.to(
      athleteSignal,
      { scaleY: 1.14, transformOrigin: 'bottom center', duration: 1.8 },
      0,
    ).to(athleteSignal, { scaleY: 1, duration: 1.8 }, 1.8);
    idle.push(tl);
  }

  if (!idle.length) return;

  const scope = ScrollTrigger.create({
    trigger: roles,
    start: 'top 84%',
    end: 'bottom top',
    onToggle: (self) => {
      idle.forEach((timeline) => (self.isActive ? timeline.play() : timeline.pause()));
    },
  });

  if (scope.isActive) idle.forEach((timeline) => timeline.play());
}

/* El punto Signal recorre el trazado del póster de seguimiento. */
function initTrackRoute() {
  const path = $<SVGPathElement>('[data-track-route]');
  const runner = $<SVGGElement>('[data-track-runner]');
  if (!path || !runner) return;

  const travel = gsap.to(runner, {
    motionPath: {
      path,
      align: path,
      alignOrigin: [0.5, 0.5],
    },
    duration: 9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    paused: true,
  });

  ScrollTrigger.create({
    trigger: path,
    start: 'top 90%',
    end: 'bottom top',
    onEnter: () => travel.play(),
    onLeave: () => travel.pause(),
    onEnterBack: () => travel.play(),
    onLeaveBack: () => travel.pause(),
  });
}

function initIdea() {
  const path = $('#u-idea-arc');
  const dot = $<SVGCircleElement>('[data-idea-dot]');
  if (!path || !dot) return;

  const travel = gsap.to(dot, {
    motionPath: {
      path,
      align: path,
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
    },
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    paused: true,
  });

  const pulse = gsap.to(dot, {
    scale: 1.5,
    transformOrigin: 'center center',
    duration: 1.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    paused: true,
  });

  ScrollTrigger.create({
    trigger: '#u-idea-title',
    start: 'top 82%',
    end: 'bottom 18%',
    onEnter: () => {
      travel.play();
      pulse.play();
    },
    onLeave: () => {
      travel.pause();
      pulse.pause();
    },
    onEnterBack: () => {
      travel.play();
      pulse.play();
    },
    onLeaveBack: () => {
      travel.pause();
      pulse.pause();
    },
  });
}

/* ==========================================================================
   SCROLL SUAVE Y ANCLAS
   ========================================================================== */

function initLenis() {
  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    touchMultiplier: 1.1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Ajustes del scroll de anclas. Si quieres que sea más rápido o más lento,
  // toca estos cuatro números: max/min son segundos, y divisor más alto =
  // recorrido más corto.
  const anchorScroll = {
    min: 1,
    max: 1.8,
    base: 0.6,
    divisor: 2600,
  };

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.classList.contains('skip-link')) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const href = link.getAttribute('href');
    if (!href || href.length < 2) return;

    const section = document.querySelector<HTMLElement>(href);
    if (!section) return;

    event.preventDefault();

    const distance = Math.abs(section.getBoundingClientRect().top);
    const duration = Math.min(
      anchorScroll.max,
      Math.max(anchorScroll.min, anchorScroll.base + distance / anchorScroll.divisor),
    );

    lenis?.scrollTo(section, {
      offset: 0,
      duration,
      easing: easeInOutCubic,
    });
    window.history.pushState(null, '', href);
  });
}

/* ==========================================================================
   INTERACCIONES SIN ANIMACIÓN
   ========================================================================== */

function fallbackCopy(text: string) {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  fallbackCopy(text);
}

function initCopyButtons() {
  $$<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      if (!value) return;

      const label = $<HTMLElement>('[data-copy-label]', button);
      const original = label?.textContent ?? 'Copiar enlace';

      try {
        await copyText(value.startsWith('http') ? value : `https://${value}`);
        if (label) label.textContent = 'Copiado';
      } catch {
        if (label) label.textContent = 'No se pudo copiar';
      }

      window.setTimeout(() => {
        if (label) label.textContent = original;
      }, 1800);
    });
  });
}

function initWaitlist() {
  const form = $<HTMLFormElement>('[data-waitlist]');
  if (!form) return;

  const email = form.querySelector<HTMLInputElement>('input[type="email"]');
  const role = form.querySelector<HTMLSelectElement>('select');
  const trap = form.querySelector<HTMLInputElement>('input[name="website"]');
  const error = $<HTMLElement>('[data-form-error]');
  const done = $<HTMLElement>('[data-form-done]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = $<HTMLElement>('[data-submit-label]');

  const setError = (message: string) => {
    if (!error) return;
    error.textContent = message;
    error.hidden = !message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !email.value.trim()) {
      setError('Escribe tu correo para pedir acceso.');
      email?.focus();
      return;
    }

    if (!email.checkValidity()) {
      setError('Ese correo no parece válido.');
      email.focus();
      return;
    }

    const payload = {
      email: email.value.trim(),
      role: role?.value ?? 'club',
      source: window.location.href,
      ts: new Date().toISOString(),
      website: trap?.value ?? '',
    };

    submit?.setAttribute('disabled', '');
    form.setAttribute('aria-busy', 'true');
    if (label) label.textContent = 'Enviando…';

    try {
      const endpoint =
        (import.meta.env as Record<string, string | undefined>).PUBLIC_WAITLIST_ENDPOINT ??
        '/api/waitlist';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(data?.error ?? 'No hemos podido enviarlo. Inténtalo de nuevo en un momento.');
      }

      form.hidden = true;
      if (done) {
        done.hidden = false;
        if (animate) gsap.from(done, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' });
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'No hemos podido enviarlo. Inténtalo de nuevo en un momento.';
      setError(message);
      if (label) label.textContent = 'Pedir acceso';
      submit?.removeAttribute('disabled');
    } finally {
      form.removeAttribute('aria-busy');
    }
  });
}

/* ==========================================================================
   ARRANQUE
   ========================================================================== */

function initInteractions() {
  initNav();
  initFicheCarousel();
  initPlanTabs();
  initTrackTabs();
  initCopyButtons();
  initWaitlist();
}

function initMotion() {
  root.classList.add('motion');

  initLenis();
  initHero();
  initReveals();
  initSplits();
  initRoleArt();
  initCounters();
  initBars();
  initMeters();
  initPhaseBars();
  initDraws();
  initIdea();
  initTrackRoute();

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

function boot() {
  initInteractions();

  if (!animate) {
    root.classList.remove('js');
    return;
  }

  try {
    initMotion();
  } catch (error) {
    root.classList.remove('js', 'motion');
    splitCache.forEach((split) => split.revert());
    splitCache = [];
    console.error('[umbral] No se pudo iniciar el movimiento:', error);
  }
}

if (document.fonts?.ready) {
  document.fonts.ready.then(boot).catch(boot);
} else {
  boot();
}
