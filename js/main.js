/**
 * SEN DIAGNOSTICS - MULTI-PAGE 3D & CLINICAL ENGINE
 * Tailwind + Vanilla 3D integration
 * Functions:
 * - 3D Canvas Molecular Mesh (Home)
 * - 3D Flip-Flop Card Mechanics (Packages & Home)
 * - Real-Time Test Search & Category Filter (Tests & Home)
 * - Interactive Booking Engine & Direct WhatsApp Dispatch
 * - 2026 List of Holidays Modal
 * - Mobile Navigation Drawer
 * - Toast Feedback Alerts
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DCanvas();
  init3DTilt();
  initFlipCards();
  initTestDirectory();
  initBookingSystem();
  initHolidayModal();
  initAccordion();
  initMobileNav();
  initTimelineTree();
});

/* ==========================================================================
   1. Interactive 3D Canvas Molecular Simulation (Home Page Hero)
   ========================================================================== */
function init3DCanvas() {
  const container = document.getElementById('canvas3d-container');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-3d-canvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 45;
  const connectionDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 160
  };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = container.clientWidth;
    height = canvas.height = container.clientHeight;
    createParticles();
  }

  class BioNode {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 200 + 50;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = (Math.random() * 3 + 2) * (this.z / 150);
      
      // Clinical palette: Medical Cyan, Charcoal Blue, Orange
      const colors = ['#0284C7', '#38BDF8', '#EA580C', '#10B981'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      const alpha = this.baseAlpha * (this.z / 200);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new BioNode());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#0284C7';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    connectParticles();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* ==========================================================================
   2. 3D Perspective Tilt on Mouse Movement
   ========================================================================== */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('[data-3d-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   3. 3D Flip-Flop Card Mechanics & Advanced Gesture System (Click, Hover, Swipe)
   ========================================================================== */
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card-3d-wrap');

  flipCards.forEach(card => {
    // 1. Inject Visual Gesture Corner Fold on Front Face
    const frontFace = card.querySelector('.flip-card-3d-front');
    if (frontFace && !frontFace.querySelector('.flip-corner-fold')) {
      const fold = document.createElement('div');
      fold.className = 'flip-corner-fold';
      fold.setAttribute('title', 'Click or swipe to flip card');
      fold.innerHTML = '<i class="fas fa-sync-alt"></i>';
      frontFace.appendChild(fold);
    }

    // 2. Triggers that flip card forward to back
    const flipTriggers = card.querySelectorAll('.btn-trigger-flip, .flip-flop-indicator, .flip-corner-fold');
    flipTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('flipped');
      });
    });

    // 3. Triggers that flip back to front
    const backTriggers = card.querySelectorAll('.btn-flip-back');
    backTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('flipped');
      });
    });

    // 4. Clicking anywhere on front face (except buttons/links) flips to back
    if (frontFace) {
      frontFace.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        card.classList.add('flipped');
      });
    }

    // 5. Clicking on back face (except buttons/links/scrollable area) flips back
    const backFace = card.querySelector('.flip-card-3d-back');
    if (backFace) {
      backFace.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.back-test-scroll-area')) return;
        card.classList.remove('flipped');
      });
    }

    // 6. Mobile & Desktop Touch / Swipe Gesture
    let touchStartX = 0;
    let touchStartY = 0;
    card.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      // If horizontal swipe is distinct and greater than 40px:
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
        if (diffX < 0) {
          // Swiped left -> flip to tests
          card.classList.add('flipped');
        } else {
          // Swiped right -> flip back to front
          card.classList.remove('flipped');
        }
      }
    }, { passive: true });

    // 7. Mouse Pointer Dynamic 3D Tilt Gesture on Hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -5;
      const tiltY = ((x - centerX) / centerX) * 5;

      const inner = card.querySelector('.flip-card-3d-inner');
      if (!inner) return;

      if (card.classList.contains('flipped')) {
        inner.style.transform = `rotateY(180deg) rotateX(${tiltX * 0.7}deg) rotateY(${tiltY * 0.7}deg)`;
      } else {
        inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.flip-card-3d-inner');
      if (!inner) return;
      if (card.classList.contains('flipped')) {
        inner.style.transform = 'rotateY(180deg)';
      } else {
        inner.style.transform = 'rotateY(0deg)';
      }
    });

    // 8. Keyboard Accessibility (Enter or Space key to flip)
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'region');
    card.setAttribute('aria-label', '3D Interactive Health Package Card. Press Enter to flip.');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('button') || e.target.closest('a')) return;
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  // Package Category Tabs
  const tabBtns = document.querySelectorAll('.tab-filter-package');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('bg-[#F37021]', 'bg-gray-900', 'text-white', 'border-[#F37021]', 'shadow-md');
        b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
      });
      btn.classList.add('bg-[#F37021]', 'text-white', 'border-[#F37021]', 'shadow-md');
      btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');

      const filter = btn.getAttribute('data-filter');
      flipCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Real-Time Diagnostic Test Search Engine
   ========================================================================== */
const testDatabase = [
  { name: 'Complete Blood Count (CBC) with Peripheral Smear', price: 350, sample: 'EDTA Whole Blood', time: 'Same Day', cat: 'hematology' },
  { name: 'Kidney Function Test (KFT / RFT - 7 Tests)', price: 900, sample: 'Serum (Fasting/Random)', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Liver Function Test (LFT - 11 Tests)', price: 900, sample: 'Serum (Fasting)', time: 'Same Day', cat: 'biochemistry' },
  { name: 'LFT + KFT Combo Profile', price: 1530, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Lipid Profile (8 Essential Parameters)', price: 900, sample: 'Serum (10-12 hrs Fasting)', time: 'Same Day', cat: 'cardiac' },
  { name: 'HbA1c (Glycosylated Hemoglobin)', price: 500, sample: 'EDTA Blood (Random)', time: 'Same Day', cat: 'diabetes' },
  { name: 'Thyroid Profile Total (T3, T4, TSH)', price: 600, sample: 'Serum (Fasting)', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Vitamin D (25-Hydroxy)', price: 1200, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Vitamin B12 (Cyanocobalamin)', price: 1000, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Serum Ferritin', price: 650, sample: 'Serum', time: 'Same Day', cat: 'hematology' },
  { name: 'HOMA-IR (Insulin Resistance Index)', price: 900, sample: 'Fasting Serum', time: 'Same Day', cat: 'diabetes' },
  { name: 'Blood Urea Nitrogen (BUN)', price: 150, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Serum Creatinine', price: 150, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Serum Uric Acid', price: 150, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Serum Electrolytes (Na+, K+, Cl-)', price: 450, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Beta Thalassemia HPLC (Hemoglobin Variant)', price: 1000, sample: 'EDTA Whole Blood', time: '48 Hours', cat: 'hematology' },
  { name: 'Cardiac High-Sensitivity CRP (hs-CRP)', price: 600, sample: 'Serum', time: 'Same Day', cat: 'cardiac' },
  { name: 'NT-proBNP (Heart Failure Marker)', price: 2500, sample: 'Serum/Plasma', time: 'Same Day', cat: 'cardiac' },
  { name: 'Troponin-I (High Sensitivity)', price: 1400, sample: 'Serum', time: 'Same Day', cat: 'cardiac' },
  { name: 'D-Dimer Quantitative Assay', price: 1200, sample: 'Citrate Plasma', time: 'Same Day', cat: 'hematology' },
  { name: 'Urine Albumin:Creatinine Ratio (ACR)', price: 550, sample: 'Spot Urine', time: 'Same Day', cat: 'routine' },
  { name: 'Urine Routine & Microscopic Examination', price: 150, sample: 'Clean Catch Urine', time: 'Same Day', cat: 'routine' },
  { name: 'Blood Glucose (Fasting or PP or Random)', price: 60, sample: 'Fluoride Plasma', time: 'Same Day', cat: 'diabetes' },
  { name: 'Total IgE (Allergy Screening Marker)', price: 800, sample: 'Serum', time: 'Same Day', cat: 'immunology' },
  { name: 'Rheumatoid Factor (RA Factor) Quantitative', price: 400, sample: 'Serum', time: 'Same Day', cat: 'immunology' },
  { name: 'Anti-Streptolysin O (ASO Titre)', price: 400, sample: 'Serum', time: 'Same Day', cat: 'immunology' },
  { name: 'Viral Markers Combo (HIV 1 & 2, HBsAg, HCV)', price: 1200, sample: 'Serum', time: 'Same Day', cat: 'immunology' },
  { name: 'Microbiological Automated Culture & Sensitivity', price: 800, sample: 'Urine/Pus/Sputum', time: '48-72 Hours', cat: 'routine' },
  { name: 'Serum Lipase / Amylase', price: 700, sample: 'Serum', time: 'Same Day', cat: 'biochemistry' },
  { name: 'Fluid Analysis (Pleural / Ascitic Fluid)', price: 750, sample: 'Aspirated Fluid', time: 'Same Day', cat: 'routine' }
];

function initTestDirectory() {
  const searchInput = document.getElementById('test-search-field');
  const resultsGrid = document.getElementById('tests-display-grid');
  const categoryPills = document.querySelectorAll('.category-pill-filter');
  const counterSpan = document.getElementById('test-count-indicator');

  if (!resultsGrid) return;

  let currentCategory = 'all';
  let query = '';

  function render() {
    const list = testDatabase.filter(item => {
      const matchCat = currentCategory === 'all' || item.cat === currentCategory;
      const matchQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
                         item.sample.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });

    if (counterSpan) {
      counterSpan.textContent = `${list.length} Diagnostic Tests Available`;
    }

    if (list.length === 0) {
      resultsGrid.innerHTML = `
        <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
          <i class="fas fa-search text-4xl text-orange-500 mb-3"></i>
          <h4 class="text-xl font-bold text-gray-900 mb-1">No diagnostic test found for "${query}"</h4>
          <p class="text-gray-500 text-sm">Please call our Budh Marg central desk at <strong>+91 7481953528</strong> for assistance.</p>
        </div>
      `;
      return;
    }

    resultsGrid.innerHTML = list.map(t => `
      <div class="test-catalog-card">
        <div>
          <span class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1 block">${t.cat}</span>
          <h4 class="text-lg font-bold text-gray-900 mb-2">${highlight(t.name, query)}</h4>
          <div class="flex items-center gap-3 text-xs text-gray-500 mb-4">
            <span><i class="far fa-clock text-sky-600 mr-1"></i> ${t.time}</span>
            <span><i class="fas fa-vial text-orange-500 mr-1"></i> ${t.sample}</span>
          </div>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-dashed border-gray-200 mt-2">
          <span class="text-xl font-extrabold text-gray-900">₹${t.price.toLocaleString('en-IN')}</span>
          <button class="btn-hospital-outline text-xs px-3 py-1.5" onclick="openBookingModal('${t.name.replace(/'/g, "\\'")}', ${t.price})">
            <i class="fas fa-plus mr-1"></i> Book
          </button>
        </div>
      </div>
    `).join('');
  }

  function highlight(text, q) {
    if (!q) return text;
    const r = new RegExp(`(${q})`, 'gi');
    return text.replace(r, '<mark class="bg-orange-100 text-orange-700 px-1 rounded">$1</mark>');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      query = e.target.value.trim();
      render();
    });
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-cat');
      render();
    });
  });

  render();
}

/* ==========================================================================
   5. Interactive Booking System & WhatsApp Dispatch
   ========================================================================== */
function initBookingSystem() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('close-booking-modal');
  const form = document.getElementById('booking-form');

  if (!modal) return;

  window.openBookingModal = function(itemName = 'Sen 360 Health Profile (with Urine)', price = 4800) {
    const itemInput = document.getElementById('book-test-name');
    const priceDisplay = document.getElementById('book-price-display');

    if (itemInput) itemInput.value = itemName;
    if (priceDisplay) priceDisplay.textContent = `₹${price.toLocaleString('en-IN')}`;

    const dateInput = document.getElementById('book-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', window.closeBookingModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeBookingModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-patient-name').value.trim();
      const phone = document.getElementById('book-patient-phone').value.trim();
      const testName = document.getElementById('book-test-name').value.trim();
      const date = document.getElementById('book-date').value;
      const slot = document.getElementById('book-slot').value;
      const type = document.querySelector('input[name="collection-type"]:checked').value;
      const address = document.getElementById('book-address').value.trim();

      if (!name || !phone) {
        showToast('Please enter patient name and contact number.', 'error');
        return;
      }

      const text = `*New Diagnostic Booking Request - Sen Diagnostics*\n` +
                   `----------------------------------------\n` +
                   `• *Patient Name:* ${name}\n` +
                   `• *Phone:* ${phone}\n` +
                   `• *Investigation / Package:* ${testName}\n` +
                   `• *Date & Slot:* ${date} (${slot})\n` +
                   `• *Type:* ${type === 'home' ? 'Home Sample Collection' : 'Lab Visit (Budh Marg, Patna)'}\n` +
                   (address ? `• *Address:* ${address}\n` : '') +
                   `----------------------------------------\n` +
                   `Please confirm this booking and send pre-test preparation instructions.`;

      const whatsappUrl = `https://wa.me/917481955502?text=${encodeURIComponent(text)}`;

      window.closeBookingModal();
      showToast('Redirecting to Sen Diagnostics WhatsApp Booking Desk...', 'success');

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }
}

/* ==========================================================================
   6. 2026 List of Holidays Modal
   ========================================================================== */
function initHolidayModal() {
  const modal = document.getElementById('holiday-modal');
  const openBtns = document.querySelectorAll('.open-holiday-modal');
  const closeBtn = document.getElementById('close-holiday-modal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

/* ==========================================================================
   7. Accordion Controller
   ========================================================================== */
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header-toggle');
  headers.forEach(h => {
    h.addEventListener('click', () => {
      const parent = h.closest('.accordion-item-wrap');
      const body = parent.querySelector('.accordion-body-content');
      const icon = h.querySelector('.accordion-icon');

      const isHidden = body.classList.contains('hidden');
      document.querySelectorAll('.accordion-body-content').forEach(b => b.classList.add('hidden'));
      document.querySelectorAll('.accordion-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (isHidden) {
        body.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   8. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle') || document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu-drawer') || document.getElementById('mobile-menu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

/* Toast Message Utility */
function showToast(message, type = 'success') {
  let toast = document.getElementById('hospital-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hospital-toast';
    toast.className = 'hospital-toast-box';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
  const color = type === 'success' ? '#10B981' : '#EA580C';

  toast.innerHTML = `
    <i class="fas ${icon}" style="color: ${color}; font-size: 1.25rem;"></i>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

window.showToast = showToast;

/* ==========================================================================
   9. Interactive 3D Timeline Tree Engine ("tree ko acha se kro edit niche aaye tho next option dikhe or uspr click kre tho float ho")
   ========================================================================== */
function initTimelineTree() {
  const treeContainer = document.querySelector('.timeline-tree-container');
  if (!treeContainer) return;

  const branchItems = treeContainer.querySelectorAll('.tree-branch-item');
  const yearPills = document.querySelectorAll('.tree-year-pill');
  const nextBtn = document.getElementById('tree-next-milestone-btn');
  let currentActiveIndex = -1;

  // 1. Scroll-triggered progressive reveal ("niche aaye tho next option dikhe")
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tree-node-visible');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    branchItems.forEach(item => observer.observe(item));
  } else {
    branchItems.forEach(item => item.classList.add('tree-node-visible'));
  }

  // 2. Click to Float effect ("uspr click kre tho float ho")
  branchItems.forEach((item, index) => {
    const card = item.querySelector('.tree-milestone-card');
    const marker = item.querySelector('.tree-node-marker');

    function toggleFloat(e) {
      if (e.target.closest('a') && !e.target.closest('.btn-trigger-tree-float')) return;
      e.stopPropagation();

      const isFloating = card.classList.contains('tree-card-floating');

      // Reset all floating cards first
      branchItems.forEach(b => {
        const c = b.querySelector('.tree-milestone-card');
        if (c) c.classList.remove('tree-card-floating');
        b.classList.remove('tree-active');
      });

      // Toggle current
      if (!isFloating) {
        card.classList.add('tree-card-floating');
        item.classList.add('tree-active');
        item.classList.add('tree-node-visible');
        currentActiveIndex = index;

        // Update corresponding year pill
        const year = item.getAttribute('data-year');
        if (year) {
          yearPills.forEach(p => {
            if (p.getAttribute('data-year') === year) {
              yearPills.forEach(yp => yp.classList.remove('active'));
              p.classList.add('active');
            }
          });
        }
      } else {
        currentActiveIndex = -1;
      }
    }

    if (card) {
      card.addEventListener('click', toggleFloat);
      // Support for instant iOS tap
      card.addEventListener('touchend', (e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          toggleFloat(e);
        }
      }, { passive: true });
    }
    if (marker) {
      marker.addEventListener('click', toggleFloat);
    }
  });

  // 3. Year Pills Navigation ("Jump to Year & Float")
  yearPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetYear = pill.getAttribute('data-year');
      yearPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetItem = treeContainer.querySelector(`.tree-branch-item[data-year="${targetYear}"]`);
      if (targetItem) {
        // Reset others
        branchItems.forEach(b => {
          const c = b.querySelector('.tree-milestone-card');
          if (c) c.classList.remove('tree-card-floating');
          b.classList.remove('tree-active');
        });

        // Make visible and float
        targetItem.classList.add('tree-node-visible');
        targetItem.classList.add('tree-active');
        const c = targetItem.querySelector('.tree-milestone-card');
        if (c) c.classList.add('tree-card-floating');

        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // 4. "Next Milestone" Controller Button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentActiveIndex = (currentActiveIndex + 1) % branchItems.length;
      const targetItem = branchItems[currentActiveIndex];
      if (targetItem) {
        branchItems.forEach(b => {
          const c = b.querySelector('.tree-milestone-card');
          if (c) c.classList.remove('tree-card-floating');
          b.classList.remove('tree-active');
        });

        targetItem.classList.add('tree-node-visible');
        targetItem.classList.add('tree-active');
        const c = targetItem.querySelector('.tree-milestone-card');
        if (c) c.classList.add('tree-card-floating');

        const year = targetItem.getAttribute('data-year');
        if (year) {
          yearPills.forEach(p => {
            if (p.getAttribute('data-year') === year) {
              yearPills.forEach(yp => yp.classList.remove('active'));
              p.classList.add('active');
            }
          });
        }

        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}
