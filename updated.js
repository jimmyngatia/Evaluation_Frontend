/* ══════════════════════════════════════════════════════
   UoEm CU Semester Evaluation — updated.js (v3)
   ══════════════════════════════════════════════════════ */
   'use strict';

   // ═══════════════════════════════════════════════════════════════
   // DATA STRUCTURE
   // ═══════════════════════════════════════════════════════════════
   const evaluationData = {
     weeklyServices: {
       sessions: [],
       ratings: { timeManagement: 0, content: 0, speakers: 0 },
       additionalInfo: ''
     },
     services: {
       sessions: [],
       ratings: { timeManagement: 0, content: 0, speakers: 0 },
       additionalInfo: ''
     },
     spiritualGrowth: {
       growth: 5,
       programs: [],
       attendance: '',
       additionalInfo: ''
     },
     ministries: {
       involved: [],
       activityLevel: '',
       additionalInfo: ''
     },
     leadership: {
       vision: 5,
       communication: 5,
       approachability: 5,
       decisionMaking: 5,
       additionalInfo: ''
     },
     generalOverview: {
       improvements: [],
       bestExperience: '',
       improvementText: '',
       recommendation: ''
     },
     recommendations: {
       topics: [],
       speaker: { name: '', email: '', phone: '', bio: '' },
       firstName: '',
       facultySchool: '',
       yearOfStudy: '',
       tenureInCU: ''
     }
   };
   
   let currentSection = 0;
   const totalSections = 7;
   
   // Rating word labels for star badges
   const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
   
   // ═══════════════════════════════════════════════════════════════
   // INIT
   // ═══════════════════════════════════════════════════════════════
   document.addEventListener('DOMContentLoaded', () => {
     initWeeklyServices();
     initServices();
     initStarRatings();
     initPrograms();
     initAttendance();
     initMinistries();
     initActivity();
     initLeadershipSliders();
     initGrowthSlider();
     initImprovementTags();
     initRecommendation();
     initDropdowns();
     initYearPills();
     initTenureList();
     initTopicSuggestions();
     initProgress();
     updateProgressBar();
     updateButtons();
   });
   
   // ═══════════════════════════════════════════════════════════════
   // WEEKLY SERVICES CHECKBOXES (Section 0)
   // ═══════════════════════════════════════════════════════════════
   function initWeeklyServices() {
     const services = ['AnzaFyt', 'Best-P', 'Class Fellowship', 'Faith Foundation'];
     buildCheckboxGrid('weeklyServicesGrid', services);
   }
   
   // ═══════════════════════════════════════════════════════════════
   // SERVICES CHECKBOXES (Section 1)
   // ═══════════════════════════════════════════════════════════════
   function initServices() {
     const services = ['Intercessory', 'Praises and Worship', 'Sermons', 'Creative Presentations'];
     buildCheckboxGrid('servicesGrid', services);
   }
   
   function buildCheckboxGrid(containerId, items) {
     const container = document.getElementById(containerId);
     if (!container) return;
     items.forEach(item => {
       const div = document.createElement('div');
       div.className = 'checkbox-item';
       div.innerHTML = `
         <input type="checkbox" value="${item}" tabindex="-1">
         <label class="checkbox-label">${item}</label>
       `;
       div.addEventListener('click', (e) => {
         if (e.target.tagName === 'INPUT') return; // handled below
         toggleCheckboxItem(div);
       });
       const chk = div.querySelector('input');
       chk.addEventListener('change', () => {
         div.classList.toggle('selected', chk.checked);
       });
       container.appendChild(div);
     });
   }
   
   function toggleCheckboxItem(el) {
     const chk = el.querySelector('input[type="checkbox"]');
     chk.checked = !chk.checked;
     el.classList.toggle('selected', chk.checked);
   }
   
   // ═══════════════════════════════════════════════════════════════
   // STAR RATINGS — new large filled-star system
   // ═══════════════════════════════════════════════════════════════
   const STAR_KEYS = [
     { key: 'weeklyTime',      section: 'weeklyServices', field: 'timeManagement' },
     { key: 'weeklyContent',   section: 'weeklyServices', field: 'content'        },
     { key: 'weeklySpeakers',  section: 'weeklyServices', field: 'speakers'       },
     { key: 'serviceTime',     section: 'services',       field: 'timeManagement' },
     { key: 'serviceContent',  section: 'services',       field: 'content'        },
     { key: 'serviceSpeakers', section: 'services',       field: 'speakers'       },
   ];
   
   // Runtime store for current star values
   const starValues = {};
   
   function initStarRatings() {
     STAR_KEYS.forEach(({ key }) => {
       starValues[key] = 0;
     });
   
     document.querySelectorAll('.stars[data-key]').forEach(container => {
       const key = container.dataset.key;
       const sectionKey = container.dataset.section;
       const fieldKey   = container.dataset.field;
       const badge      = document.getElementById('badge-' + key);
   
       // Build 5 star buttons
       for (let i = 1; i <= 5; i++) {
         const btn = document.createElement('button');
         btn.className = 'star';
         btn.dataset.val = i;
         btn.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
         btn.innerHTML = `<svg viewBox="0 0 24 24">
           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
         </svg>`;
         container.appendChild(btn);
       }
   
       const stars = [...container.querySelectorAll('.star')];
   
       function paintStars(upTo) {
         stars.forEach(s => {
           const v = +s.dataset.val;
           s.classList.toggle('active', v <= upTo);
           s.classList.toggle('hover', false);
         });
       }
   
       // Hover preview
       stars.forEach(s => {
         s.addEventListener('mouseenter', () => {
           const hv = +s.dataset.val;
           const sv = starValues[key] || 0;
           stars.forEach(t => {
             const tv = +t.dataset.val;
             t.classList.remove('active', 'hover');
             if (tv <= sv) t.classList.add('active');
             if (tv > sv && tv <= hv) t.classList.add('hover');
           });
         });
         s.addEventListener('mouseleave', () => paintStars(starValues[key] || 0));
   
         // Click to rate
         s.addEventListener('click', () => {
           const val = +s.dataset.val;
           starValues[key] = val;
   
           // Update data store
           if (evaluationData[sectionKey] && evaluationData[sectionKey].ratings) {
             evaluationData[sectionKey].ratings[fieldKey] = val;
           }
   
           paintStars(val);
   
           // Pop animation
           s.classList.add('pop');
           setTimeout(() => s.classList.remove('pop'), 180);
   
           // Badge
           if (badge) {
             badge.textContent = STAR_LABELS[val];
             badge.classList.add('visible');
           }
         });
       });
   
       // Init at 0
       paintStars(0);
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // PROGRAMS (Section 2)
   // ═══════════════════════════════════════════════════════════════
   function initPrograms() {
     const programs = [
       'Best P', 'Anzafyt', 'Vukafyt', 'Faith Foundation',
       'CU services', 'Brothers & Sisters talks', 'Bible Study', 'Minisry meetups',
       'Day-time Prayers', 'Morning devotions', 'Outreach', 'Inreach Evangeism'
     ];
     const container = document.getElementById('programBoxes');
     if (!container) return;
   
     programs.forEach(program => {
       const div = document.createElement('div');
       div.className = 'program-box';
       div.textContent = program;
       div.addEventListener('click', () => {
         div.classList.toggle('selected');
         const sel = div.classList.contains('selected');
         if (sel && !evaluationData.spiritualGrowth.programs.includes(program)) {
           evaluationData.spiritualGrowth.programs.push(program);
         } else {
           evaluationData.spiritualGrowth.programs = evaluationData.spiritualGrowth.programs.filter(p => p !== program);
         }
       });
       container.appendChild(div);
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // ATTENDANCE (Section 2)
   // ═══════════════════════════════════════════════════════════════
   function initAttendance() {
     const items = [
       { label: 'Never',        value: 'never',        height: '22%'  },
       { label: 'Occasionally', value: 'occasionally', height: '44%'  },
       { label: 'Regularly',    value: 'regularly',    height: '68%'  },
       { label: 'Always',       value: 'always',       height: '100%' }
     ];
     const container = document.getElementById('attendanceVisual');
     if (!container) return;
   
     items.forEach(item => {
       const div = document.createElement('div');
       div.className = 'attendance-bar';
       div.innerHTML = `
         <div class="bar-height" style="height:${item.height}"></div>
         <span class="bar-label">${item.label}</span>
       `;
       div.addEventListener('click', () => {
         container.querySelectorAll('.attendance-bar').forEach(b => b.classList.remove('selected'));
         div.classList.add('selected');
         evaluationData.spiritualGrowth.attendance = item.value;
       });
       container.appendChild(div);
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // MINISTRIES — compact checkbox grid like screenshot 5
   // ═══════════════════════════════════════════════════════════════
   function initMinistries() {
     const ministries = [
       'PW & Choir', 'IT', 'Technical', 'Ushering',
       'Missions', 'Inreach', 'Sunday School', 'Creative',
       'Logistics', 'Catering', 'Other'
     ];
     const container = document.getElementById('ministryGrid');
     if (!container) return;
   
     ministries.forEach(ministry => {
       const div = document.createElement('div');
       div.className = 'min-item';
       div.innerHTML = `
         <div class="min-chk">
           <div class="min-chk-inner"></div>
         </div>
         <span class="min-label">${ministry}</span>
       `;
       div.addEventListener('click', () => {
         div.classList.toggle('selected');
         const sel = div.classList.contains('selected');
         if (sel && !evaluationData.ministries.involved.includes(ministry)) {
           evaluationData.ministries.involved.push(ministry);
         } else {
           evaluationData.ministries.involved = evaluationData.ministries.involved.filter(m => m !== ministry);
         }
       });
       container.appendChild(div);
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // ACTIVITY LEVEL (Section 3)
   // ═══════════════════════════════════════════════════════════════
   function initActivity() {
     const activities = [
       {
         label: 'Very Passive', value: 'very-passive',
         icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="10" x2="16" y2="10"/>
                </svg>`
       },
       {
         label: 'Passive', value: 'passive',
         icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 13 8 9 11 12 16 7"/>
                </svg>`
       },
       {
         label: 'Active', value: 'active',
         icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 14 7 10 10 12 13 8 16 5"/>
                  <polyline points="13 5 16 5 16 8"/>
                </svg>`
       },
       {
         label: 'Very Active', value: 'very-active',
         icon: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="10 2 12.5 7.5 18.5 8.2 14 12.5 15.3 18.5 10 15.5 4.7 18.5 6 12.5 1.5 8.2 7.5 7.5"/>
                </svg>`
       }
     ];
   
     const container = document.getElementById('activityVisual');
     if (!container) return;
   
     activities.forEach(act => {
       const div = document.createElement('div');
       div.className = 'activity-card';
       div.innerHTML = `
         <div class="activity-icon">${act.icon}</div>
         <div class="activity-name">${act.label}</div>
       `;
       div.addEventListener('click', () => {
         container.querySelectorAll('.activity-card').forEach(a => a.classList.remove('selected'));
         div.classList.add('selected');
         evaluationData.ministries.activityLevel = act.value;
       });
       container.appendChild(div);
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // GROWTH SLIDER (Section 2)
   // ═══════════════════════════════════════════════════════════════
   function initGrowthSlider() {
     const slider = document.getElementById('growthSlider');
     const valueEl = document.getElementById('growthValue');
     if (!slider) return;
     slider.addEventListener('input', () => {
       const v = +slider.value;
       if (valueEl) valueEl.textContent = v;
       evaluationData.spiritualGrowth.growth = v;
       updateSliderBg(slider);
     });
     updateSliderBg(slider);
   }
   
   // ═══════════════════════════════════════════════════════════════
   // LEADERSHIP SLIDERS (Section 4)
   // ═══════════════════════════════════════════════════════════════
   function initLeadershipSliders() {
     const configs = [
       { id: 'visionSlider',         valId: 'visionValue',         key: 'vision'         },
       { id: 'communicationSlider',  valId: 'communicationValue',  key: 'communication'  },
       { id: 'approachabilitySlider',valId: 'approachabilityValue',key: 'approachability'},
       { id: 'decisionSlider',       valId: 'decisionValue',       key: 'decisionMaking' }
     ];
     configs.forEach(({ id, valId, key }) => {
       const sl = document.getElementById(id);
       const ve = document.getElementById(valId);
       if (!sl) return;
       sl.addEventListener('input', () => {
         const v = +sl.value;
         if (ve) ve.textContent = v;
         evaluationData.leadership[key] = v;
         updateSliderBg(sl);
       });
       updateSliderBg(sl);
     });
   }
   
   function updateSliderBg(slider) {
     const pct = ((+slider.value - +slider.min) / (+slider.max - +slider.min)) * 100;
     slider.style.setProperty('--pct', pct + '%');
   }
   
   // ═══════════════════════════════════════════════════════════════
   // IMPROVEMENT TAGS (Section 5)
   // ═══════════════════════════════════════════════════════════════
   function initImprovementTags() {
     const tags = [
       'Teaching Quality', 'Time Management', 'Venue & Facilities',
       'Youth Engagement', 'Community Building', 'Music & Worship',
       'Accessibility', 'Communication', 'Prayer & Spirituality'
     ];
     const container = document.getElementById('improvementTags');
     if (!container) return;
   
     tags.forEach(tag => {
       const btn = document.createElement('button');
       btn.className = 'tag-btn';
       // Small tag icon
       btn.innerHTML = `
         <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
           <path d="M1 1h5l5 5-5 5-5-5V1z"/>
           <circle cx="3.5" cy="3.5" r=".5" fill="currentColor" stroke="none"/>
         </svg>
         ${tag}
       `;
       btn.addEventListener('click', (e) => {
         e.preventDefault();
         btn.classList.toggle('selected');
         if (btn.classList.contains('selected')) {
           if (!evaluationData.generalOverview.improvements.includes(tag))
             evaluationData.generalOverview.improvements.push(tag);
         } else {
           evaluationData.generalOverview.improvements = evaluationData.generalOverview.improvements.filter(t => t !== tag);
         }
       });
       container.appendChild(btn);
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // RECOMMENDATION RADIO (Section 5)
   // ═══════════════════════════════════════════════════════════════
   function initRecommendation() {
     document.querySelectorAll('input[name="recommendation"]').forEach(radio => {
       radio.addEventListener('change', (e) => {
         const parent = e.target.closest('.mc-opt');
         document.querySelectorAll('.mc-opt').forEach(o => o.classList.remove('selected'));
         if (parent) {
           parent.classList.add('selected');
           evaluationData.generalOverview.recommendation = e.target.value;
         }
       });
     });
   
     // Allow clicking the label row itself
     document.querySelectorAll('.mc-opt').forEach(opt => {
       opt.addEventListener('click', () => {
         const radio = opt.querySelector('input[type="radio"]');
         if (radio) {
           radio.checked = true;
           radio.dispatchEvent(new Event('change'));
         }
       });
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // YEAR PILLS (Section 6 — About You)
   // ═══════════════════════════════════════════════════════════════
   function initYearPills() {
     const container = document.getElementById('yearPills');
     if (!container) return;
     container.querySelectorAll('.year-pill').forEach(btn => {
       btn.addEventListener('click', () => {
         container.querySelectorAll('.year-pill').forEach(b => b.classList.remove('selected'));
         btn.classList.add('selected');
         evaluationData.recommendations.yearOfStudy = btn.dataset.value;
       });
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // TENURE LIST (Section 6 — About You)
   // ═══════════════════════════════════════════════════════════════
   function initTenureList() {
     document.querySelectorAll('.tenure-item').forEach(btn => {
       btn.addEventListener('click', () => {
         document.querySelectorAll('.tenure-item').forEach(b => b.classList.remove('selected'));
         btn.classList.add('selected');
         evaluationData.recommendations.tenureInCU = btn.dataset.value;
       });
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // DROPDOWNS (optional additional info)
   // ═══════════════════════════════════════════════════════════════
   function initDropdowns() {
     document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
       trigger.addEventListener('click', () => {
         const targetId = trigger.dataset.target;
         const targetEl = document.getElementById(targetId);
         if (!targetEl) return;
   
         const isVisible = targetEl.style.display === 'block';
         targetEl.style.display = isVisible ? 'none' : 'block';
         trigger.classList.toggle('open', !isVisible);
   
         targetEl.addEventListener('input', (e) => {
           const value = e.target.value;
           if (targetId === 'weeklyAdditional')   evaluationData.weeklyServices.additionalInfo = value;
           if (targetId === 'serviceAdditional')  evaluationData.services.additionalInfo = value;
           if (targetId === 'growthAdditional')   evaluationData.spiritualGrowth.additionalInfo = value;
           if (targetId === 'ministryAdditional') evaluationData.ministries.additionalInfo = value;
           if (targetId === 'leadershipAdditional') evaluationData.leadership.additionalInfo = value;
         }, { once: false });
       });
     });
   }
   
   // ═══════════════════════════════════════════════════════════════
   // TOPIC SUGGESTIONS (Section 6)
   // ═══════════════════════════════════════════════════════════════
   function initTopicSuggestions() {
     const addBtn = document.getElementById('addSuggestion');
     if (addBtn) addBtn.addEventListener('click', addTopicRow);
   }
   
   function addTopicRow() {
     const container = document.getElementById('topicSuggestions');
     const div = document.createElement('div');
     div.className = 'suggestion-item';
     div.innerHTML = `
       <select class="topic-category">
         <option value="">Select Category</option>
         <option value="spirituality">Spirituality &amp; Faith</option>
         <option value="relationships">Social Life</option>
         <option value="career">Career &amp; Purpose</option>
         <option value="finances">Finances &amp; Stewardship</option>
       </select>
       <input type="text" class="topic-input" placeholder="Topic name…">
     `;
     container.appendChild(div);
   }
   
   // ═══════════════════════════════════════════════════════════════
   // PROGRESS BAR
   // ═══════════════════════════════════════════════════════════════
   function initProgress() {
     const progressSteps = document.getElementById('progressSteps');
     if (!progressSteps) return;
   
     const steps = [
       'Weekly Services', 'Services', 'Spiritual Growth',
       'Ministries', 'Leadership', 'Overview', 'Recommendations'
     ];
   
     steps.forEach((step, idx) => {
       const btn = document.createElement('button');
       btn.className = 'ps-item' + (idx === 0 ? ' active' : '');
       btn.innerHTML = `
         <div class="ps-dot"></div>
         <span class="ps-label">${step}</span>
         ${idx < steps.length - 1 ? '<div class="ps-line"></div>' : ''}
       `;
       btn.disabled = idx > 0;
       btn.addEventListener('click', () => {
         if (idx <= currentSection) {
           storeCurrentSectionData();
           currentSection = idx;
           updatePanels();
           updateProgressBar();
           updateButtons();
           window.scrollTo({ top: 0, behavior: 'smooth' });
         }
       });
       progressSteps.appendChild(btn);
     });
   }
   
   function updateProgressBar() {
     const progFill = document.getElementById('progFill');
     const currentStepEl = document.getElementById('currentStep');
     if (progFill) progFill.style.width = (((currentSection + 1) / totalSections) * 100) + '%';
     if (currentStepEl) currentStepEl.textContent = currentSection + 1;
   
     document.querySelectorAll('.ps-item').forEach((item, idx) => {
       item.classList.remove('active', 'done');
       if (idx === currentSection) item.classList.add('active');
       else if (idx < currentSection) item.classList.add('done');
       item.disabled = idx > currentSection;
     });
   }
   
   function updatePanels() {
     document.querySelectorAll('.panel').forEach((p, idx) => {
       p.classList.toggle('active', idx === currentSection);
     });
     updateButtons();
   }
   
   // ═══════════════════════════════════════════════════════════════
   // NAVIGATION
   // ═══════════════════════════════════════════════════════════════
   function changePanel(direction) {
     const newSection = currentSection + direction;
     if (newSection < 0 || newSection >= totalSections) return;
   
     storeCurrentSectionData();
   
     document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
     const panels = document.querySelectorAll('.panel');
     if (panels[newSection]) panels[newSection].classList.add('active');
   
     currentSection = newSection;
     updateProgressBar();
     updateButtons();
     window.scrollTo({ top: 0, behavior: 'smooth' });
   }
   
   function updateButtons() {
     const prevBtn = document.getElementById('prevBtn');
     const nextBtn = document.getElementById('nextBtn');
     if (!prevBtn || !nextBtn) return;
   
     prevBtn.style.display = currentSection === 0 ? 'none' : 'flex';
   
     if (currentSection === totalSections - 1) {
       nextBtn.innerHTML = `Submit
         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="4 10 9 15 16 5"/>
         </svg>`;
       nextBtn.onclick = submitEvaluation;
     } else {
       nextBtn.innerHTML = `Next
         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="7 5 12 10 7 15"/>
         </svg>`;
       nextBtn.onclick = () => changePanel(1);
     }
   }
   
   // ═══════════════════════════════════════════════════════════════
   // STORE DATA
   // ═══════════════════════════════════════════════════════════════
   function storeCurrentSectionData() {
     // Section 0 — Weekly Services sessions
     if (currentSection === 0) {
       evaluationData.weeklyServices.sessions = getCheckedValues('weeklyServicesGrid');
     }
     // Section 1 — Services sessions
     if (currentSection === 1) {
       evaluationData.services.sessions = getCheckedValues('servicesGrid');
     }
     // Section 5 — General Overview text
     if (currentSection === 5) {
       const be = document.getElementById('bestExperience');
       const it = document.getElementById('improvementText');
       if (be) evaluationData.generalOverview.bestExperience = be.value;
       if (it) evaluationData.generalOverview.improvementText = it.value;
     }
     // Section 6 — Recommendations + About You
     if (currentSection === 6) {
       const fn = document.getElementById('firstName');
       const fs = document.getElementById('facultySchool');
       const sn = document.getElementById('speakerName');
       const se = document.getElementById('speakerEmail');
       const sp = document.getElementById('speakerPhone');
       const sb = document.getElementById('speakerBio');
       if (fn) evaluationData.recommendations.firstName    = fn.value;
       if (fs) evaluationData.recommendations.facultySchool= fs.value;
       if (sn) evaluationData.recommendations.speaker.name  = sn.value;
       if (se) evaluationData.recommendations.speaker.email = se.value;
       if (sp) evaluationData.recommendations.speaker.phone = sp.value;
       if (sb) evaluationData.recommendations.speaker.bio   = sb.value;
   
       // Topics
       const topics = [];
       document.querySelectorAll('.suggestion-item').forEach(item => {
         const cat   = item.querySelector('.topic-category')?.value;
         const topic = item.querySelector('.topic-input')?.value;
         if (cat && topic) topics.push({ category: cat, topic });
       });
       evaluationData.recommendations.topics = topics;
     }
   }
   
   function getCheckedValues(containerId) {
     const container = document.getElementById(containerId);
     if (!container) return [];
     return [...container.querySelectorAll('input[type="checkbox"]:checked')].map(i => i.value);
   }
   
   // ═══════════════════════════════════════════════════════════════
   // SUBMIT
   // ═══════════════════════════════════════════════════════════════
   function submitEvaluation() {
     storeCurrentSectionData();
     evaluationData.submittedAt = new Date().toISOString();
   
     console.log('Evaluation submitted:', evaluationData);
   
     // Show thank you overlay
     const overlay = document.getElementById('successOverlay');
     if (overlay) {
       overlay.style.display = 'grid';
       overlay.setAttribute('aria-modal', 'true');
     }
   
     // Optionally send to backend:
     // fetch('/api/evaluations', {
     //   method: 'POST',
     //   headers: { 'Content-Type': 'application/json' },
     //   body: JSON.stringify(evaluationData)
     // });
   }