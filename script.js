
'use strict';

const state = {
  step:    0,
  total:   5,
  done:    new Set(),
  answers: {}
};
const STAR_WORDS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
const $  = id => document.getElementById(id);
const $$ = s  => document.querySelectorAll(s);

/* ── NAVIGATION ── */
function goTo(step) {
  $$('.panel').forEach(p => p.classList.remove('active'));
  $('panel' + step).classList.add('active');
  state.step = step;
  updateWizard();
  const mainEl = $('mainContent');
  if (mainEl) {
    const offset = mainEl.getBoundingClientRect().top + window.scrollY - 112;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
}

/* ── UI SYNC ── */
function updateWizard() {
  const pct = Math.round((state.done.size / state.total) * 100);
  $('progFill').style.width = pct + '%';
  $('progLabel').textContent = state.done.size + ' / ' + state.total;

  $$('.ps-item').forEach((item, i) => {
    item.classList.remove('active', 'done');
    if (i === state.step) item.classList.add('active');
    else if (state.done.has(i)) item.classList.add('done');
  });
}

$$('.ps-item').forEach((item, i) => {
  item.addEventListener('click', () => { if (i < state.step) goTo(i); });
});

/* ── STARS ── */
$$('[data-star-group]').forEach(group => {
  const key   = group.dataset.starGroup;
  const stars = [...group.querySelectorAll('.star')];
  const badge = document.getElementById('sh-' + key);

  function paint(upTo) {
    stars.forEach(s => {
      const v = +s.dataset.val;
      s.classList.toggle('active', v <= upTo);
      s.classList.toggle('hover',  false);
    });
  }

  stars.forEach(s => {
    s.addEventListener('mouseenter', () => {
      const hoverVal = +s.dataset.val;
      const savedVal = state.answers[key] || 0;
      stars.forEach(t => {
        const tv = +t.dataset.val;
        t.classList.remove('active', 'hover');
        if (tv <= savedVal) t.classList.add('active');
        if (tv <= hoverVal && tv > savedVal) t.classList.add('hover');
      });
    });
    s.addEventListener('mouseleave', () => { paint(state.answers[key] || 0); });
    s.addEventListener('click', () => {
      const val = +s.dataset.val;
      state.answers[key] = val;
      paint(val);
      s.classList.add('pop');
      setTimeout(() => s.classList.remove('pop'), 180);
      if (badge) { badge.textContent = STAR_WORDS[val]; badge.classList.add('visible'); }
      checkDone(0);
    });
  });
});

/* ── COMPLETION CHECK ── */
function checkDone(step) {
  const a = state.answers;
  const rules = {
    0: () => a.meetings || a.teaching || a.fellowship,
    1: () => a.growth && a.inclusion,
    2: () => a.program && a.attendance,
    3: () => true,
    4: () => {
      const h = (a.highlight  || '').trim();
      const s = (a.suggestion || '').trim();
      return h.length > 5 || s.length > 5 || a.tenure || (a.fname || '').trim();
    }
  };
  if (rules[step] && rules[step]()) state.done.add(step);
  else state.done.delete(step);
  updateWizard();
}

/* ── MOOD BUTTONS ── */
$$('[data-mood-group]').forEach(group => {
  const key  = group.dataset.moodGroup;
  const btns = group.querySelectorAll('.mood-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.answers[key] = btn.dataset.value;
      checkDone(1);
    });
  });
});

/* ── MULTIPLE CHOICE ── */
$$('[data-mc-group]').forEach(container => {
  const key  = container.dataset.mcGroup;
  const opts = container.querySelectorAll('.mc-opt');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.answers[key] = opt.dataset.value;
      if (key === 'program' || key === 'attendance') checkDone(2);
      if (key === 'tenure') checkDone(4);
    });
  });
});

/* ── SLIDERS ── */
$$('.rating-slider').forEach(slider => {
  const key    = slider.dataset.key;
  const dispEl = document.getElementById('sv-' + key);
  function updateSlider() {
    const v   = +slider.value;
    const min = +slider.min;
    const max = +slider.max;
    const pct = ((v - min) / (max - min)) * 100;
    slider.style.setProperty('--pct', pct + '%');
    if (dispEl) { const valEl = dispEl.querySelector('.sl-val'); if (valEl) valEl.textContent = v; }
    state.answers[key] = v;
    state.done.add(3);
    updateWizard();
  }
  slider.addEventListener('input', updateSlider);
  updateSlider();
});

/* ── TAG PILLS ── */
$$('[data-tag-group]').forEach(container => {
  const key    = container.dataset.tagGroup;
  const btns   = container.querySelectorAll('.tag-btn');
  const isRadio = key === 'year';
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRadio) {
        btns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.answers[key] = btn.dataset.value;
      } else {
        btn.classList.toggle('selected');
        state.answers[key] = [...btns].filter(b => b.classList.contains('selected')).map(b => b.dataset.value);
      }
      checkDone(4);
    });
  });
});

/* ── TEXTAREAS ── */
const taHighlight  = $('ta-highlight');
const taSuggestion = $('ta-suggestion');
if (taHighlight)  taHighlight.addEventListener('input',  function() { $('hc').textContent = this.value.length; state.answers.highlight  = this.value; checkDone(4); });
if (taSuggestion) taSuggestion.addEventListener('input', function() { $('sc').textContent = this.value.length; state.answers.suggestion = this.value; checkDone(4); });
['fname','faculty'].forEach(id => { const el = $(id); if (el) el.addEventListener('input', () => { state.answers[id] = el.value; checkDone(4); }); });

/* ── SUBMIT ── */
function handleSubmit() {
  const btn = $('submitBtn');
  if (!btn || btn.disabled) return;
  btn.disabled = true; btn.textContent = 'Submitting…';
  state.answers.submittedAt = new Date().toISOString();
  console.log('Evaluation submitted:', state.answers);
  setTimeout(() => {
    const overlay = $('successScreen');
    overlay.classList.add('show');
    overlay.removeAttribute('aria-hidden');
  }, 900);
}

function closeSuccess() {
  $('successScreen').classList.remove('show');
  $('successScreen').setAttribute('aria-hidden', 'true');
  resetForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => goTo(0), 300);
}

/* ── RESET ── */
function resetForm() {
  state.step = 0; state.answers = {}; state.done.clear();
  $$('[data-star-group]').forEach(group => group.querySelectorAll('.star').forEach(s => s.classList.remove('active','hover','pop')));
  $$('.star-badge').forEach(b => { b.textContent = ''; b.classList.remove('visible'); });
  $$('.mood-btn, .mc-opt, .tag-btn').forEach(el => el.classList.remove('selected'));
  $$('.rating-slider').forEach(sl => { sl.value = '5'; sl.dispatchEvent(new Event('input')); });
  if (taHighlight)  { taHighlight.value  = ''; $('hc').textContent = '0'; }
  if (taSuggestion) { taSuggestion.value = ''; $('sc').textContent = '0'; }
  ['fname','faculty'].forEach(id => { const e = $(id); if (e) e.value = ''; });
  const btn = $('submitBtn');
  if (btn) { btn.disabled = false; btn.innerHTML = 'Submit Evaluation <svg viewBox="0 0 24 24" width="15" height="15" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>'; }
}

(function init() { updateWizard(); })();
