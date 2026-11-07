'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. MOBILE NAVIGATION DRAWER & TOGGLE
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  if (navToggle && navMenu) {
    const toggleNavigation = (forceState) => {
      const isExpanded = forceState !== undefined
        ? forceState
        : navToggle.getAttribute('aria-expanded') !== 'true';

      navToggle.setAttribute('aria-expanded', isExpanded);
      navToggle.classList.toggle('open', isExpanded);
      navMenu.classList.toggle('open', isExpanded);

      // Prevent background scrolling when mobile menu is open
      if (window.innerWidth <= 768) {
        document.body.style.overflow = isExpanded ? 'hidden' : '';
      }
    };

    navToggle.addEventListener('click', () => {
      toggleNavigation();
    });

    // Close mobile nav when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleNavigation(false);
        }
      });
    });

    // Close mobile nav when pressing the Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleNavigation(false);
      }
    });

    // Ensure body scroll is restored on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        toggleNavigation(false);
        document.body.style.overflow = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. STICKY HEADER ELEVATION ON SCROLL
  // --------------------------------------------------------------------------
  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --------------------------------------------------------------------------
  // 3. ACTIVE NAVIGATION SCROLL SPY
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
  highlightActiveNavLink();

  // --------------------------------------------------------------------------
  // 4. UNIFIED TECHNOLOGY PROGRAMS SEARCH & CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');
  const searchInput = document.getElementById('course-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchCountBadge = document.getElementById('search-count-badge');
  const quickTagPills = document.querySelectorAll('.quick-tag-pill');
  const emptyState = document.getElementById('programs-empty-state');
  const emptyQueryTerm = document.getElementById('empty-query-term');
  const resetFiltersBtn = document.getElementById('btn-reset-filters');

  let activeCategory = 'all';
  let activeSearchTerm = '';

  const applyProgramFilters = () => {
    let visibleCount = 0;
    const query = activeSearchTerm.toLowerCase().trim();

    programCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = (!query || cardText.includes(query));

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });

    // Update status badge
    if (searchCountBadge) {
      if (query || activeCategory !== 'all') {
        searchCountBadge.textContent = `Showing ${visibleCount} of ${programCards.length} programs`;
      } else {
        searchCountBadge.textContent = `Showing all ${programCards.length} programs`;
      }
    }

    // Toggle Clear button visibility
    if (searchClearBtn) {
      searchClearBtn.style.display = query.length > 0 ? 'inline-block' : 'none';
    }

    // Toggle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = 'block';
        if (emptyQueryTerm) {
          emptyQueryTerm.textContent = activeSearchTerm || activeCategory;
        }
      } else {
        emptyState.style.display = 'none';
      }
    }
  };

  // Category Tab Click Handler
  if (filterButtons.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        activeCategory = button.getAttribute('data-filter') || 'all';
        applyProgramFilters();
      });
    });
  }

  // Live Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchTerm = e.target.value;
      applyProgramFilters();
    });
  }

  // Clear Search Button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        activeSearchTerm = '';
        searchInput.focus();
        applyProgramFilters();
      }
    });
  }

  // Quick Search Pill Click Handler
  if (quickTagPills.length) {
    quickTagPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const keyword = pill.getAttribute('data-keyword');
        if (searchInput && keyword) {
          searchInput.value = keyword;
          activeSearchTerm = keyword;
          applyProgramFilters();
          searchInput.focus();
        }
      });
    });
  }

  // Reset Filters & Search Button Handler
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      activeCategory = 'all';
      activeSearchTerm = '';
      if (searchInput) searchInput.value = '';
      filterButtons.forEach(btn => {
        const isAll = btn.getAttribute('data-filter') === 'all';
        btn.classList.toggle('active', isAll);
        btn.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      applyProgramFilters();
    });
  }

  // --------------------------------------------------------------------------
  // 5. ACCESSIBLE FAQ ACCORDION
  // --------------------------------------------------------------------------
  const faqButtons = document.querySelectorAll('.faq-question');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const targetId = button.getAttribute('aria-controls');
      const targetAnswer = document.getElementById(targetId);

      // Close all other open FAQ items for a clean accordion experience
      faqButtons.forEach(otherButton => {
        if (otherButton !== button) {
          otherButton.setAttribute('aria-expanded', 'false');
          const otherId = otherButton.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) {
            otherAnswer.hidden = true;
          }
        }
      });

      // Toggle clicked question
      button.setAttribute('aria-expanded', !isExpanded);
      if (targetAnswer) {
        targetAnswer.hidden = isExpanded;
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. CONTACT & ENROLLMENT FORM VALIDATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successAlert = document.getElementById('form-success');

  if (contactForm) {
    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email-address');
    const phoneInput = document.getElementById('phone-number');
    const inquirySelect = document.getElementById('inquiry-type');
    const messageInput = document.getElementById('message-content');

    // Helper validation functions
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPhone = (phone) => {
      // Strips non-digits; requires at least 10 digits
      const digits = phone.replace(/\D/g, '');
      return digits.length >= 10;
    };

    const setValidationState = (input, errorId, isValid) => {
      const errorElement = document.getElementById(errorId);
      if (!isValid) {
        input.classList.add('is-invalid');
        if (errorElement) errorElement.classList.add('visible');
      } else {
        input.classList.remove('is-invalid');
        if (errorElement) errorElement.classList.remove('visible');
      }
      return isValid;
    };

    // Live validation on blur
    nameInput?.addEventListener('blur', () => {
      setValidationState(nameInput, 'name-error', nameInput.value.trim().length >= 2);
    });

    emailInput?.addEventListener('blur', () => {
      setValidationState(emailInput, 'email-error', isValidEmail(emailInput.value.trim()));
    });

    phoneInput?.addEventListener('blur', () => {
      setValidationState(phoneInput, 'phone-error', isValidPhone(phoneInput.value.trim()));
    });

    inquirySelect?.addEventListener('change', () => {
      setValidationState(inquirySelect, 'type-error', inquirySelect.value !== '');
    });

    messageInput?.addEventListener('blur', () => {
      setValidationState(messageInput, 'message-error', messageInput.value.trim().length >= 15);
    });

    // Form submission handler
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const isNameValid = setValidationState(nameInput, 'name-error', nameInput.value.trim().length >= 2);
      const isEmailValid = setValidationState(emailInput, 'email-error', isValidEmail(emailInput.value.trim()));
      const isPhoneValid = setValidationState(phoneInput, 'phone-error', isValidPhone(phoneInput.value.trim()));
      const isTypeValid = setValidationState(inquirySelect, 'type-error', inquirySelect.value !== '');
      const isMessageValid = setValidationState(messageInput, 'message-error', messageInput.value.trim().length >= 15);

      const isFormValid = isNameValid && isEmailValid && isPhoneValid && isTypeValid && isMessageValid;

      if (!isFormValid) {
        // Focus first invalid element
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Simulate asynchronous form submission with spinner
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Display success alert
        if (successAlert) {
          successAlert.hidden = false;
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form inputs
        contactForm.reset();

        // Auto hide success alert after 8 seconds
        setTimeout(() => {
          if (successAlert) {
            successAlert.hidden = true;
          }
        }, 8000);
      }, 900);
    });
  }

  // --------------------------------------------------------------------------
  // 7. PROGRAM & INTERNSHIP PRE-POPULATION SHORTCUTS
  // --------------------------------------------------------------------------
  const programEnrollBtns = document.querySelectorAll('.program-enroll-btn');
  const internshipApplyBtn = document.getElementById('btn-internship-apply');
  const inquirySelect = document.getElementById('inquiry-type');
  const messageInput = document.getElementById('message-content');

  // When user clicks "Enroll & Inquire" on a program card
  programEnrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const programName = btn.getAttribute('data-program');
      if (inquirySelect) {
        inquirySelect.value = 'training';
      }
      if (messageInput && programName) {
        messageInput.value = `Hello Veda Technology Team, I would like to inquire about the curriculum, eligibility, and upcoming batch schedule for the "${programName}" program.`;
      }
    });
  });

  // When user clicks "Apply for Internship" button
  if (internshipApplyBtn) {
    internshipApplyBtn.addEventListener('click', () => {
      if (inquirySelect) {
        inquirySelect.value = 'internship';
      }
      if (messageInput) {
        messageInput.value = `Hello Veda Technology Team, I am interested in applying for the student/graduate internship program. Please share the assessment criteria and cohort details.`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. FLOATING BACK-TO-TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    const handleBackToTopVisibility = () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
    handleBackToTopVisibility();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. DARK / LIGHT THEME TOGGLE
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('veda-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('veda-theme', theme);
    } catch (e) {
      /* Safe storage fallback */
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 10. ANIMATED MILESTONE COUNTERS
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = Math.max(0, now - startTime);
        const progress = Math.min(elapsed / duration, 1);
        // Smooth cubic ease-out
        const easeVal = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeVal * target);

        el.textContent = currentCount.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      statNumbers.forEach(stat => statsObserver.observe(stat));
    } else {
      statNumbers.forEach(stat => animateCounter(stat));
    }
  }

  // --------------------------------------------------------------------------
  // 11. UPCOMING BATCH LIVE COUNTDOWN TIMER
  // --------------------------------------------------------------------------
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');
  const countdownClaimBtn = document.getElementById('btn-countdown-claim');

  if (daysEl && hoursEl && minsEl && secsEl) {
    // Dynamic countdown target (14 days forward, stored in localStorage to keep consistent clock)
    const STORAGE_KEY = 'veda_cohort_deadline_ts';
    let targetTime = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    const nowTime = Date.now();

    // If no target stored or deadline has already passed, schedule 14 days out
    if (!targetTime || targetTime < nowTime) {
      targetTime = nowTime + (14 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000);
      try {
        localStorage.setItem(STORAGE_KEY, targetTime.toString());
      } catch (e) {
        /* storage safe */
      }
    }

    const updateCountdown = () => {
      const remainingMs = Math.max(0, targetTime - Date.now());

      const d = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const h = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remainingMs / (1000 * 60)) % 60);
      const s = Math.floor((remainingMs / 1000) % 60);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Countdown CTA handler (pre-selects internship inquiry)
  if (countdownClaimBtn) {
    countdownClaimBtn.addEventListener('click', () => {
      const inquirySelect = document.getElementById('inquiry-type');
      const messageInput = document.getElementById('message-content');
      const nameInput = document.getElementById('full-name');

      if (inquirySelect) inquirySelect.value = 'internship';
      if (messageInput) {
        messageInput.value = 'Hello Veda Technology Admissions, I would like to reserve my developer slot for the upcoming Winter 2026 Live Internship Cohort.';
      }
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 400);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. CLIENT CASE STUDIES & ENTERPRISE PORTFOLIO MODAL
  // --------------------------------------------------------------------------
  const caseStudiesData = {
    fintech: {
      client: 'Global NeoBank Solutions',
      category: 'Fintech & Cloud Systems',
      title: 'Real-Time Payment Clearing & High-Concurrency Engine',
      challenge: 'The neobank processed millions of multi-currency digital payments daily but struggled with 300ms+ latency spikes, database lock contention during flash promotions, and unexpected service drops during peak hours.',
      solution: 'Veda Technology’s engineering squad decomposed the monolithic clearing pipeline into distributed, stateless Node.js microservices coordinated through Redis stream queues and backed by read-replica PostgreSQL clusters deployed on AWS ECS with auto-scaling.',
      metrics: [
        { val: '2.5M+', lbl: 'Daily Processed Txns' },
        { val: '<35ms', lbl: 'Average Latency' },
        { val: '99.999%', lbl: 'Zero Downtime SLA' }
      ],
      techStack: ['Node.js', 'PostgreSQL', 'Redis Streams', 'Docker', 'AWS ECS', 'Terraform'],
      quote: '"Veda Technology completely stabilized our payment core before our peak transaction season. Our latency dropped by 88% and not a single transaction was dropped."',
      author: 'Head of Infrastructure, Global NeoBank'
    },
    healthcare: {
      client: 'MediCare Health Systems',
      category: 'Healthcare & HIPAA Cloud',
      title: 'Cloud EHR SaaS & Telehealth Consultation Portal',
      challenge: 'Managing over 120,000 sensitive clinical records on fragmented on-premises clinic servers led to severe compliance audit risks, slow retrieval times, and unreliable remote telemedicine visits.',
      solution: 'Engineered a centralized, multi-tenant cloud EHR platform utilizing React and Python FastAPI, featuring field-level encryption with AWS KMS, automated disaster recovery, and HIPAA-compliant WebRTC end-to-end encrypted video rooms.',
      metrics: [
        { val: '120K+', lbl: 'Active Patients Served' },
        { val: '-45%', lbl: 'Cloud Infrastructure Spend' },
        { val: '100%', lbl: 'HIPAA & SOC-2 Audit Pass' }
      ],
      techStack: ['React', 'Python FastAPI', 'PostgreSQL', 'AWS KMS', 'WebRTC', 'Docker'],
      quote: '"The transition to Veda’s cloud architecture was seamless. Doctors love the fast record search, and our compliance team breezed through our annual HIPAA audit."',
      author: 'Chief Medical Information Officer, MediCare'
    },
    logistics: {
      client: 'SwiftLogistics India',
      category: 'AI & Fleet Logistics',
      title: 'AI Predictive Fleet Routing & Real-Time Telematics',
      challenge: 'Fleet managers experienced high fuel costs, severe delivery delays due to unpredictable urban bottlenecks, and high vehicle empty-mileage across inter-state corridors.',
      solution: 'Developed dynamic predictive routing microservices combining OpenStreetMap GIS data with custom PyTorch models predicting traffic anomalies, driver rest schedules, and multi-drop delivery orders in real time.',
      metrics: [
        { val: '32%', lbl: 'Fleet Fuel Cost Reduction' },
        { val: '4,200+', lbl: 'Vehicles Dispatched Daily' },
        { val: '-24%', lbl: 'Reduction in Delivery Delays' }
      ],
      techStack: ['Python', 'PyTorch', 'FastAPI', 'Redis', 'OpenStreetMap', 'PostGIS'],
      quote: '"The AI route optimizer delivered measurable ROI within 6 weeks. Our fuel expenditure plunged by nearly a third while on-time deliveries reached an all-time high."',
      author: 'VP of Operations, SwiftLogistics'
    },
    edtech: {
      client: 'EduFuture International',
      category: 'EdTech & Streaming Platform',
      title: 'Multi-Tenant Interactive LMS & Live Cloud Classroom',
      challenge: 'Legacy learning portal suffered severe degradation and server crashes when more than 5,000 simultaneous students joined live interactive exam reviews and video lectures.',
      solution: 'Architected an edge-accelerated Next.js and Node.js microservices framework backed by scalable WebSockets, automated browser code runners, and AWS CloudFront CDN video packaging.',
      metrics: [
        { val: '65K+', lbl: 'Concurrent Live Learners' },
        { val: '1.1s', lbl: 'Average Page Load Time' },
        { val: '4.9 / 5', lbl: 'Student & Educator CSAT' }
      ],
      techStack: ['Next.js', 'Node.js', 'MongoDB', 'WebSockets', 'AWS CloudFront', 'Docker'],
      quote: '"Veda Technology built an educational engine that scaled past 65,000 live users without a hiccup. The synchronized whiteboard and code sandbox are unmatched."',
      author: 'Founder & CEO, EduFuture International'
    }
  };

  const modalOverlay = document.getElementById('case-modal-overlay');
  const modalCategory = document.getElementById('modal-case-category');
  const modalClient = document.getElementById('modal-case-client');
  const modalTitle = document.getElementById('modal-case-title');
  const modalBody = document.getElementById('modal-case-body');
  const modalCloseIcon = document.getElementById('modal-close-icon');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalDiscussBtn = document.getElementById('modal-discuss-btn');
  const openCaseModalBtns = document.querySelectorAll('.open-case-modal-btn');

  let activeModalCaseKey = null;

  const openCaseModal = (caseKey) => {
    const data = caseStudiesData[caseKey];
    if (!data || !modalOverlay) return;

    activeModalCaseKey = caseKey;

    if (modalCategory) modalCategory.textContent = data.category;
    if (modalClient) modalClient.textContent = data.client;
    if (modalTitle) modalTitle.textContent = data.title;

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="modal-section">
          <h4 class="modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            The Challenge & Problem Context
          </h4>
          <p class="modal-text">${data.challenge}</p>
        </div>

        <div class="modal-section">
          <h4 class="modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            Engineered Solution & System Architecture
          </h4>
          <p class="modal-text">${data.solution}</p>
        </div>

        <div class="modal-section">
          <h4 class="modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Quantifiable Business & Performance Metrics
          </h4>
          <div class="modal-metrics-grid">
            ${data.metrics.map(m => `
              <div class="modal-metric-card">
                <span class="modal-metric-val">${m.val}</span>
                <span class="modal-metric-lbl">${m.lbl}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal-section">
          <h4 class="modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Technology Stack Deployed
          </h4>
          <div class="modal-stack-pills">
            ${data.techStack.map(t => `<span class="modal-stack-pill">${t}</span>`).join('')}
          </div>
        </div>

        <div class="modal-quote-box">
          <p class="modal-quote-text">${data.quote}</p>
          <span class="modal-quote-author">— ${data.author}</span>
        </div>
      `;
    }

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalCloseIcon) modalCloseIcon.focus();
  };

  const closeCaseModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openCaseModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-case-id');
      if (caseId) openCaseModal(caseId);
    });
  });

  if (modalCloseIcon) modalCloseIcon.addEventListener('click', closeCaseModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeCaseModal);

  // Close when clicking overlay backdrop outside modal dialog
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeCaseModal();
      }
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeCaseModal();
    }
  });

  // Modal "Discuss a Similar Solution" CTA
  if (modalDiscussBtn) {
    modalDiscussBtn.addEventListener('click', () => {
      closeCaseModal();
      const inquirySelect = document.getElementById('inquiry-type');
      const messageInput = document.getElementById('message-content');
      const nameInput = document.getElementById('full-name');
      const data = caseStudiesData[activeModalCaseKey];

      if (inquirySelect) inquirySelect.value = 'development';
      if (messageInput && data) {
        messageInput.value = `Hello Veda Technology Team, I reviewed your case study "${data.title}" and would like to discuss engineering a similar solution for our organization.`;
      }
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 450);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 13. INTERACTIVE AI SUPPORT CHAT WIDGET (Pure Vanilla JavaScript)
  // --------------------------------------------------------------------------
  const chatLauncherBtn = document.getElementById('chat-launcher-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatMinimizeBtn = document.getElementById('chat-minimize-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInputField = document.getElementById('chat-input-field');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');
  const chatUnreadDot = document.getElementById('chat-unread-dot');
  const chatChipBtns = document.querySelectorAll('.chat-chip-btn');

  // Format current time (e.g. 10:45 AM)
  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Toggle Chat Window
  const toggleChatWindow = (forceState) => {
    if (!chatWindow || !chatLauncherBtn) return;
    const isOpen = forceState !== undefined ? forceState : !chatWindow.classList.contains('active');

    chatWindow.classList.toggle('active', isOpen);
    chatLauncherBtn.classList.toggle('open', isOpen);
    chatLauncherBtn.setAttribute('aria-expanded', isOpen);

    if (backToTopBtn) {
      if (isOpen) {
        backToTopBtn.classList.add('chat-drawer-open');
      } else {
        backToTopBtn.classList.remove('chat-drawer-open');
      }
    }

    if (isOpen) {
      if (chatUnreadDot) chatUnreadDot.style.display = 'none';
      if (chatInputField) setTimeout(() => chatInputField.focus(), 250);
      scrollChatToBottom();
    }
  };

  if (chatLauncherBtn) {
    chatLauncherBtn.addEventListener('click', () => toggleChatWindow());
  }

  if (chatMinimizeBtn) {
    chatMinimizeBtn.addEventListener('click', () => toggleChatWindow(false));
  }

  // Close chat on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow && chatWindow.classList.contains('active')) {
      toggleChatWindow(false);
    }
  });

  // Scroll messages to bottom smoothly
  const scrollChatToBottom = () => {
    if (chatMessages) {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Append user message
  const appendUserMessage = (text) => {
    if (!chatMessages) return;
    const row = document.createElement('div');
    row.className = 'message-row user-row';
    row.innerHTML = `
      <div class="message-bubble user-bubble">
        <p>${escapeHTML(text)}</p>
        <span class="msg-timestamp">${getFormattedTime()}</span>
      </div>
    `;
    chatMessages.appendChild(row);
    scrollChatToBottom();
  };

  // Escape HTML helper
  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Knowledge base responses generator
  const getBotResponse = (query) => {
    const q = query.toLowerCase().trim();

    if (/internship|training|intern|stipend|mentor|roadmap|capstone/.test(q)) {
      return {
        text: `Our <strong>Veda Internship Programs</strong> run for 8–12 weeks across 3 structured phases: Foundation & Tooling, Core Engineering, and Live Capstone Deployment. Interns work with senior developers on production Git repositories and earn verified credentials.`,
        actions: [
          { text: 'View Internship Tracks →', href: '#internships' },
          { text: 'Apply for Internship →', href: '#contact', inquiry: 'internship' }
        ]
      };
    }

    if (/course|program|learn|syllabus|curriculum|web|fullstack|cloud|devops|data|ai|python|flutter|mobile|cyber|security/.test(q)) {
      return {
        text: `We offer 6 specialized technology programs designed for industry readiness: <strong>Full Stack Web (16 wks)</strong>, <strong>Cloud & DevOps (12 wks)</strong>, <strong>Data Science & AI (14 wks)</strong>, <strong>Cross-Platform Mobile (12 wks)</strong>, <strong>Modern Frontend (10 wks)</strong>, and <strong>Cybersecurity (10 wks)</strong>.`,
        actions: [
          { text: 'Search Programs →', href: '#programs' },
          { text: 'Enroll / Inquire →', href: '#contact', inquiry: 'training' }
        ]
      };
    }

    if (/fee|cost|price|scholarship|installment|pay/.test(q)) {
      return {
        text: `Our program fees are transparent with zero hidden costs. We provide flexible monthly installment plans and merit-based scholarship discounts for college students. Specific fees depend on your chosen track and learning mode.`,
        actions: [
          { text: 'Get Fee Details →', href: '#contact', inquiry: 'training' }
        ]
      };
    }

    if (/service|consulting|enterprise|hire|client|custom|develop|software|app/.test(q)) {
      return {
        text: `Veda Technology delivers enterprise digital services: Custom Software Development, Cloud Migration & DevOps Automation, Mobile App Engineering (iOS & Android), UI/UX Product Design, and Automated QA Testing.`,
        actions: [
          { text: 'View IT Services →', href: '#services' },
          { text: 'Inspect Case Studies →', href: '#case-studies' },
          { text: 'Discuss Project →', href: '#contact', inquiry: 'consulting' }
        ]
      };
    }

    if (/case study|case studies|portfolio|proof|client result|work/.test(q)) {
      return {
        text: `Explore our proven track record: <strong>2.5M+ daily transactions</strong> for NeoBank, <strong>120k+ active patients</strong> for Healthcare SaaS, <strong>32% fuel savings</strong> for AI Logistics, and <strong>65k+ learners</strong> on EdTech LMS.`,
        actions: [
          { text: 'View Case Studies & Metrics →', href: '#case-studies' }
        ]
      };
    }

    if (/location|office|address|phone|email|contact|where|call/.test(q)) {
      return {
        text: `📍 <strong>Veda Technology Innovation Hub</strong><br>Lakhisarai, Bihar, India<br>📧 contact@vedatechnology.com<br>📞 +91 (0) 120-456-7890<br>Operating Hours: Mon–Sat, 9:00 AM – 7:00 PM IST.`,
        actions: [
          { text: 'Go to Contact Form →', href: '#contact' }
        ]
      };
    }

    if (/apply|admission|batch|deadline|join|register|seat/.test(q)) {
      return {
        text: `Applications for our <strong>Winter 2026 Live Cohort</strong> are actively open! Each track is strictly capped at 25 developer slots to maintain 1-on-1 mentorship standards. Only a few seats remain.`,
        actions: [
          { text: 'Claim Your Seat →', href: '#contact', inquiry: 'internship' }
        ]
      };
    }

    if (/syllabus|curriculum|module|roadmap|week|topics/.test(q)) {
      return {
        text: `Every program at Veda Technology comes with a weekly roadmap, hands-on production capstones, and tooling blueprints. Click on the <strong>📄 Syllabus</strong> button on any course card to inspect the full curriculum drawer!`,
        actions: [
          { text: 'Browse Program Syllabi →', href: '#programs' },
          { text: 'Book 1-on-1 Academic Review →', href: '#contact', action: 'book-call' }
        ]
      };
    }

    if (/counsel|demo|call|book|schedule|mentor|advisor|meeting|talk/.test(q)) {
      return {
        text: `You can schedule a <strong>Free 30-Minute 1-on-1 Technical Counseling Call</strong> with our Lead Architect! Pick your discussion focus, preferred day, and live time slot directly on our booking calendar.`,
        actions: [
          { text: '📅 Book 1-on-1 Call Now →', href: '#contact', action: 'book-call' }
        ]
      };
    }

    if (/dark|light|theme|color/.test(q)) {
      return {
        text: `You can switch between <strong>Dark Mode</strong> and <strong>Light Mode</strong> anytime using the Sun/Moon toggle button located in the top navigation bar! Your preference will be remembered automatically.`,
        actions: []
      };
    }

    // Default Fallback
    return {
      text: `Thank you for reaching out! I can help you with program curricula, internship enrollment, enterprise services, or scheduling a technical advisory session. How would you like to proceed?`,
      actions: [
        { text: 'Explore Programs →', href: '#programs' },
        { text: '📅 Book 1-on-1 Counseling →', href: '#contact', action: 'book-call' },
        { text: 'Apply for Internship →', href: '#contact', inquiry: 'internship' },
        { text: 'View FAQs →', href: '#faqs' }
      ]
    };
  };

  // Append bot response with simulated typing delay
  const appendBotResponse = (responseObj) => {
    if (!chatMessages) return;

    if (chatTypingIndicator) chatTypingIndicator.style.display = 'flex';
    scrollChatToBottom();

    setTimeout(() => {
      if (chatTypingIndicator) chatTypingIndicator.style.display = 'none';

      const row = document.createElement('div');
      row.className = 'message-row bot-row';

      let actionsHTML = '';
      if (responseObj.actions && responseObj.actions.length > 0) {
        actionsHTML = `
          <div class="chat-action-links">
            ${responseObj.actions.map(act => `
              <a href="${act.href}" class="chat-action-link" ${act.inquiry ? `data-inquiry="${act.inquiry}"` : ''} ${act.action ? `data-action="${act.action}"` : ''}>
                ${act.text}
              </a>
            `).join('')}
          </div>
        `;
      }

      row.innerHTML = `
        <div class="bot-msg-avatar">V</div>
        <div class="message-bubble bot-bubble">
          <p>${responseObj.text}</p>
          ${actionsHTML}
          <span class="msg-timestamp">${getFormattedTime()}</span>
        </div>
      `;

      chatMessages.appendChild(row);
      scrollChatToBottom();

      // Attach click events for in-message action links
      const actionLinks = row.querySelectorAll('.chat-action-link');
      actionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const inquiryType = link.getAttribute('data-inquiry');
          const actionType = link.getAttribute('data-action');
          if (inquiryType) {
            const selectEl = document.getElementById('inquiry-type');
            if (selectEl) selectEl.value = inquiryType;
          }
          if (actionType === 'book-call') {
            const tabBookingBtn = document.getElementById('tab-booking-btn');
            if (tabBookingBtn) tabBookingBtn.click();
          }
          toggleChatWindow(false);
        });
      });
    }, 450);
  };

  // Handle Chat Form Submit
  if (chatForm && chatInputField) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInputField.value.trim();
      if (!message) return;

      appendUserMessage(message);
      chatInputField.value = '';

      const botReply = getBotResponse(message);
      appendBotResponse(botReply);
    });
  }

  // Quick chips click handler
  if (chatChipBtns.length) {
    chatChipBtns.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (!query) return;

        appendUserMessage(chip.textContent.replace(/[^\w\s&]/gi, '').trim());
        const botReply = getBotResponse(query);
        appendBotResponse(botReply);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 14. INTERACTIVE SYLLABUS & CURRICULUM DRAWER CONTROLLER
  // --------------------------------------------------------------------------
  const syllabusData = {
    'full-stack': {
      title: 'Full Stack Web Engineering',
      track: 'Web & Distributed Systems',
      duration: '16 Weeks • Hybrid / Live',
      level: 'Beginner to Advanced',
      tagline: 'From foundational JavaScript and clean UI design to scalable microservices, relational databases, and cloud deployments.',
      modules: [
        {
          weeks: 'Weeks 1–4',
          title: 'Advanced JavaScript (ES6+), DOM & Asynchronous Patterns',
          topics: [
            'Modern JavaScript primitives, closures, lexical scope, and functional composition',
            'DOM manipulation, event delegation, custom events, and performance optimization',
            'Asynchronous JavaScript: Promises, async/await, Fetch API, and error boundaries',
            'Clean Architecture, SOLID principles, and modular codebase structure'
          ]
        },
        {
          weeks: 'Weeks 5–8',
          title: 'Frontend Mastery with React & State Engines',
          topics: [
            'Component lifecycles, virtual DOM reconciliation, and hooks architecture',
            'Complex state management (Context API, Redux Toolkit, and Zustand patterns)',
            'Client-side routing with GoRouter/React Router, code splitting, and lazy loading',
            'Responsive design systems, styled components, and WCAG AA accessibility'
          ]
        },
        {
          weeks: 'Weeks 9–12',
          title: 'Backend Engineering, REST APIs & Distributed Databases',
          topics: [
            'Node.js runtime, event loop mechanics, Express.js middleware pipelines',
            'Relational data modeling with PostgreSQL (indexing, transactions, ACID compliance)',
            'NoSQL with MongoDB & Redis in-memory caching for sub-millisecond lookups',
            'JWT authentication, OAuth 2.0 social login, RBAC, and rate limiting'
          ]
        },
        {
          weeks: 'Weeks 13–16',
          title: 'Production Capstone, Microservices & Cloud CI/CD',
          topics: [
            'Containerization with Docker, multi-stage builds, and environment isolation',
            'Continuous Integration & Continuous Deployment (CI/CD) with GitHub Actions',
            'Zero-downtime deployment on AWS/DigitalOcean, monitoring, and health checks',
            'Technical interview preparation, system design drills, and portfolio review'
          ]
        }
      ],
      capstones: [
        {
          icon: '🚀',
          title: 'Enterprise Multi-Tenant SaaS Platform',
          desc: 'Production-ready platform featuring team workspaces, role-based access control, Stripe payment checkout, and PostgreSQL partitioning.'
        },
        {
          icon: '⚡',
          title: 'Real-Time Collaborative Workspace',
          desc: 'Low-latency canvas and document editing powered by WebSockets, Redis Pub/Sub, and optimistic UI updates.'
        }
      ],
      tools: ['JavaScript (ES6+)', 'React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Git', 'GitHub Actions'],
      roles: ['Full Stack Developer', 'Frontend Engineer', 'Backend Specialist', 'Solutions Architect']
    },
    'cloud': {
      title: 'Cloud Computing & DevOps',
      track: 'Infrastructure & Automation',
      duration: '12 Weeks • Live Interactive',
      level: 'Intermediate to Advanced',
      tagline: 'Architect, containerize, orchestrate, and observe high-availability multi-cloud infrastructure with modern DevOps practices.',
      modules: [
        {
          weeks: 'Weeks 1–3',
          title: 'Linux Systems, Shell Scripting & Networking Fundamentals',
          topics: [
            'Linux kernel architecture, user permissions, process management, and cron jobs',
            'Bash automation scripts, text stream processing (grep, sed, awk), and SSH security',
            'TCP/IP networking, DNS resolution, subnets, NAT gateways, and SSL/TLS certificates',
            'Git branch strategies, trunk-based development, and GitOps workflows'
          ]
        },
        {
          weeks: 'Weeks 4–6',
          title: 'Containerization with Docker & Kubernetes Orchestration',
          topics: [
            'Container internals, namespaces, cgroups, and multi-stage Dockerfile optimization',
            'Docker Compose for multi-container local microservice testing',
            'Kubernetes architecture: Pods, Deployments, ReplicaSets, Services, and Ingress controllers',
            'ConfigMaps, Secrets management, Persistent Volumes, and Helm package charts'
          ]
        },
        {
          weeks: 'Weeks 7–9',
          title: 'Infrastructure as Code (Terraform) & Public Cloud (AWS)',
          topics: [
            'Declarative infrastructure modeling using Terraform modules and remote state locking',
            'AWS VPC design, public/private subnets, Security Groups, and IAM least privilege',
            'Amazon EC2, Auto Scaling Groups, Application Load Balancers, and S3 object storage',
            'Serverless computing with AWS Lambda, API Gateway, and CloudFront CDN'
          ]
        },
        {
          weeks: 'Weeks 10–12',
          title: 'CI/CD Pipelines, Site Reliability Engineering & Capstone',
          topics: [
            'Production CI/CD pipelines with GitHub Actions for automated build, test, and release',
            'Metrics monitoring with Prometheus and custom dashboard visualization with Grafana',
            'Centralized log aggregation with ELK / Loki and automated alerting alerts',
            'Live capstone: Zero-downtime blue/green deployment of a resilient microservice cluster'
          ]
        }
      ],
      capstones: [
        {
          icon: '☁️',
          title: 'High-Availability Auto-Scaling K8s Cluster',
          desc: 'Fully automated Kubernetes production cluster with self-healing deployments, horizontal pod autoscaling (HPA), and TLS ingress.'
        },
        {
          icon: '⚙️',
          title: 'GitOps Multi-Region Cloud Infrastructure',
          desc: 'Declarative AWS infrastructure provisioned with Terraform, enforcing automated security compliance tests and drift detection.'
        }
      ],
      tools: ['Linux', 'Bash', 'Docker', 'Kubernetes', 'Helm', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus', 'Grafana'],
      roles: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer (SRE)', 'Platform Engineer']
    },
    'data': {
      title: 'Data Science & AI Applications',
      track: 'Analytics & Applied Machine Learning',
      duration: '14 Weeks • Hands-on Lab',
      level: 'Beginner to Advanced',
      tagline: 'Transform raw data into strategic intelligence and train, evaluate, and deploy scalable machine learning and GenAI applications.',
      modules: [
        {
          weeks: 'Weeks 1–3',
          title: 'Python for Data Analysis & Statistical Foundations',
          topics: [
            'Python data structures, object-oriented principles, and memory management for large datasets',
            'High-performance vectorized operations with NumPy arrays and matrices',
            'Data wrangling, cleaning, normalization, and aggregation using Pandas DataFrames',
            'Descriptive and inferential statistics, hypothesis testing (p-values, ANOVA, t-tests)'
          ]
        },
        {
          weeks: 'Weeks 4–7',
          title: 'Exploratory Data Analysis (EDA) & Advanced SQL Modeling',
          topics: [
            'Data visualization storytelling with Matplotlib, Seaborn, and interactive Plotly charts',
            'Advanced SQL queries, window functions, CTEs, cohort analysis, and BigQuery execution',
            'Feature engineering: encoding, scaling, imputing missing values, and outlier detection',
            'Automated data profiling and quality verification pipelines'
          ]
        },
        {
          weeks: 'Weeks 8–11',
          title: 'Machine Learning Algorithms & Model Evaluation',
          topics: [
            'Supervised learning: Linear & Logistic Regression, Decision Trees, and Random Forests',
            'Gradient boosting frameworks: XGBoost, LightGBM, and hyperparameter optimization',
            'Unsupervised learning: K-Means clustering, PCA dimensionality reduction, and DBSCAN',
            'Cross-validation, ROC-AUC, precision-recall tradeoffs, and bias-variance diagnostics'
          ]
        },
        {
          weeks: 'Weeks 12–14',
          title: 'Applied Generative AI, RAG Systems & FastAPI Deployment',
          topics: [
            'Introduction to Deep Learning with PyTorch and neural network training loops',
            'Generative AI foundations, LLM prompt engineering, and structured outputs',
            'Building Retrieval-Augmented Generation (RAG) pipelines using Chroma/Pinecone vector databases',
            'Serving ML models via asynchronous FastAPI REST endpoints wrapped in Docker'
          ]
        }
      ],
      capstones: [
        {
          icon: '📊',
          title: 'Real-Time Fraud & Churn Prediction System',
          desc: 'Streaming machine learning pipeline that flags fraudulent transactions with 94.8% precision, served via high-throughput FastAPI.'
        },
        {
          icon: '🤖',
          title: 'Autonomous Enterprise Knowledge RAG Engine',
          desc: 'Semantic search and document synthesis assistant utilizing vector embeddings and localized LLM reasoning.'
        }
      ],
      tools: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'PyTorch', 'SQL', 'FastAPI', 'Docker', 'Streamlit', 'ChromaDB'],
      roles: ['Data Scientist', 'Machine Learning Engineer', 'AI Solutions Developer', 'Data Analyst']
    },
    'mobile': {
      title: 'Cross-Platform App Development',
      track: 'Mobile UX & Native Systems',
      duration: '12 Weeks • Project Centric',
      level: 'Beginner to Intermediate',
      tagline: 'Build slick, 60fps native-feel mobile applications for iOS and Android from a unified Dart and Flutter codebase.',
      modules: [
        {
          weeks: 'Weeks 1–3',
          title: 'Dart Language Foundations & Flutter Widget Architecture',
          topics: [
            'Dart 3 language: strong typing, null safety, patterns, records, and async Streams',
            'Widget lifecycle: Stateless vs Stateful widgets and rendering pipeline mechanics',
            'Building responsive layouts with LayoutBuilder, MediaQuery, Flexbox, and CustomScrollView',
            'Material 3 & Cupertino adaptive design themes for iOS and Android parity'
          ]
        },
        {
          weeks: 'Weeks 4–6',
          title: 'Architecture & Scalable State Management',
          topics: [
            'State management deep dive using Riverpod 2.0 (Generators, Providers, Notifiers)',
            'Clean Architecture: Domain, Data, and Presentation separation of concerns',
            'Declarative navigation and deep-linking using GoRouter',
            'Custom fluid animations, implicit animations, and Hero transitions'
          ]
        },
        {
          weeks: 'Weeks 7–9',
          title: 'Network Integration, Offline Caching & Cloud Firestore',
          topics: [
            'REST API client design with HTTP and Dio, interceptors, and robust retry logic',
            'Type-safe JSON serialization and immutable models with Freezed',
            'Local persistence with SQLite and Hive for instantaneous offline loading',
            'Firebase Authentication (Email, Google, Biometrics) and Cloud Firestore real-time sync'
          ]
        },
        {
          weeks: 'Weeks 10–12',
          title: 'Native Device APIs, Store Publishing & Capstone',
          topics: [
            'Accessing native hardware: Camera, Geolocation, Accelerometer, and Permissions',
            'Push notifications integration using Firebase Cloud Messaging (FCM)',
            'Unit, Widget, and Integration testing with WidgetTester and mocktail',
            'Automated code signing, ProGuard optimization, and Google Play / Apple App Store submission'
          ]
        }
      ],
      capstones: [
        {
          icon: '📱',
          title: 'Real-Time Delivery & Geolocation Tracker',
          desc: 'Complete on-demand mobile application featuring live driver location tracking, order status websockets, and payment gateway integration.'
        },
        {
          icon: '💳',
          title: 'Personal Wealth & Expense Companion',
          desc: 'High-performance mobile financial manager with zero-latency offline synchronization, biometric locks, and interactive analytics charts.'
        }
      ],
      tools: ['Dart 3', 'Flutter', 'Riverpod', 'Firebase', 'SQLite', 'Dio', 'Git', 'Android Studio', 'Xcode', 'Fastlane'],
      roles: ['Flutter Developer', 'Mobile Application Engineer', 'Cross-Platform Specialist', 'Mobile UI/UX Architect']
    },
    'frontend': {
      title: 'Modern Frontend & UI Engineering',
      track: 'Design Systems & Web Performance',
      duration: '10 Weeks • Design to Code',
      level: 'Beginner to Advanced',
      tagline: 'Master semantic HTML5, modern CSS custom properties, reactive JavaScript, and ultra-fast Core Web Vitals optimization.',
      modules: [
        {
          weeks: 'Weeks 1–3',
          title: 'Semantic HTML5, Advanced CSS & WCAG 2.1 AA Accessibility',
          topics: [
            'Semantic markup architecture, landmarks, microdata, and SEO best practices',
            'Modern CSS Grid, Flexbox, subgrid, container queries, and fluid typography',
            'CSS Custom Properties (design tokens), dark mode architecture, and micro-interactions',
            'Web Accessibility: ARIA roles, keyboard focus traps, screen reader testing, and contrast rules'
          ]
        },
        {
          weeks: 'Weeks 4–6',
          title: 'Deep JavaScript Architecture & Browser Internals',
          topics: [
            'JavaScript execution context, call stack, task queues, and microtask scheduling',
            'Component-driven architecture without heavy framework lock-in',
            'Web APIs: IntersectionObserver, MutationObserver, ResizeObserver, and LocalStorage',
            'State machines and unidirectional data flow in client applications'
          ]
        },
        {
          weeks: 'Weeks 7–8',
          title: 'Web Performance Tuning & Core Web Vitals Optimization',
          topics: [
            'Optimizing Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS)',
            'Asset optimization: AVIF/WebP responsive picture tags, font subsetting, and critical CSS inlining',
            'Resource hints (preload, preconnect, prefetch) and service worker caching strategies',
            'DevTools performance profiling, flame charts, and layout thrashing elimination'
          ]
        },
        {
          weeks: 'Weeks 9–10',
          title: 'Production Build Pipelines, Testing & Capstone',
          topics: [
            'Modern tooling with Vite, PostCSS, Terser, and automated linting configurations',
            'Unit and component testing with Vitest/Jest and Testing Library',
            'Git branch models, PR reviews, and automated Lighthouse CI score gating in GitHub Actions',
            'Live capstone: Deploying a blazing-fast, 100/100 Lighthouse performance web application'
          ]
        }
      ],
      capstones: [
        {
          icon: '⚡',
          title: 'Ultra-Fast Accessible Design System',
          desc: 'Production-ready headless component design system with 100% keyboard accessibility, fluid responsive scales, and dual theme tokens.'
        },
        {
          icon: '🛍️',
          title: 'High-Conversion Headless E-Commerce Portal',
          desc: 'Sub-second rendering storefront with instantaneous instant-search filtering, dynamic cart drawer, and 98+ mobile Core Web Vitals.'
        }
      ],
      tools: ['HTML5', 'CSS3', 'Modern JS', 'Vite', 'PostCSS', 'Lighthouse', 'Git', 'WCAG A11y', 'Figma to Code', 'Jest'],
      roles: ['Senior Frontend Developer', 'UI Engineer', 'Design System Architect', 'Web Performance Specialist']
    },
    'cyber': {
      title: 'Cybersecurity & Network Defense',
      track: 'Security Engineering & Pen-Testing',
      duration: '10 Weeks • Practical Lab',
      level: 'Intermediate to Advanced',
      tagline: 'Understand vulnerability research, network auditing, ethical penetration testing, secure coding practices, and defensive countermeasures.',
      modules: [
        {
          weeks: 'Weeks 1–2',
          title: 'Networking Architecture, OSI Model & Packet Analysis',
          topics: [
            'Deep inspection of TCP/IP, UDP, ICMP, DNS, DHCP, and ARP protocols',
            'Live packet sniffing and protocol dissection using Wireshark and tcpdump',
            'Port scanning, OS fingerprinting, and network mapping using Nmap',
            'Firewalls (iptables, UFW), NAT traversal, and secure VPN tunneling'
          ]
        },
        {
          weeks: 'Weeks 3–5',
          title: 'Web Application Security & OWASP Top 10 Exploitation',
          topics: [
            'Detailed analysis and hands-on exploitation of SQL Injection (SQLi) and NoSQL injection',
            'Cross-Site Scripting (XSS: Stored, Reflected, DOM-based) and Content Security Policy (CSP)',
            'Cross-Site Request Forgery (CSRF), Server-Side Request Forgery (SSRF), and IDOR vulnerabilities',
            'Intercepting and manipulating web traffic with Burp Suite and OWASP ZAP'
          ]
        },
        {
          weeks: 'Weeks 6–7',
          title: 'System Hardening, Cryptography & Identity Defense',
          topics: [
            'Linux and Windows OS hardening, disabling risky services, and file permission integrity',
            'Symmetric and asymmetric encryption (AES, RSA), hashing algorithms (SHA-256, bcrypt)',
            'PKI, SSL/TLS handshake security, certificate validation, and HTTPS enforcement',
            'Authentication hardening: Multi-Factor Authentication (MFA), OAuth 2.0 security, and session management'
          ]
        },
        {
          weeks: 'Weeks 8–10',
          title: 'Penetration Testing Methodology, Incident Response & Capstone',
          topics: [
            'Reconnaissance, vulnerability scanning, exploitation frameworks (Metasploit), and privilege escalation',
            'Security information and event management (SIEM) log analysis and intrusion detection (Snort/Suricata)',
            'Incident response protocols, digital forensics fundamentals, and evidence preservation',
            'Live capstone: Conducting an authorized security assessment and delivering an executive remediation report'
          ]
        }
      ],
      capstones: [
        {
          icon: '🛡️',
          title: 'Full-Scope Web Application Penetration Test',
          desc: 'Comprehensive simulated penetration audit against a target web app, complete with proof-of-concept exploits, CVSS severity scores, and hardening recommendations.'
        },
        {
          icon: '🔒',
          title: 'Corporate Zero-Trust Defense Blueprint',
          desc: 'Hardened network architecture with segmented subnets, automated intrusion alerts, encrypted tunnels, and multi-factor access policies.'
        }
      ],
      tools: ['Kali Linux', 'Wireshark', 'Nmap', 'Burp Suite', 'Metasploit', 'OpenSSL', 'Snort', 'Bash Scripting', 'OWASP ZAP'],
      roles: ['Cybersecurity Analyst', 'Penetration Tester', 'Security Operations (SOC) Analyst', 'Vulnerability Researcher']
    }
  };

  const syllabusDrawerOverlay = document.getElementById('syllabus-drawer-overlay');
  const syllabusDrawer = document.getElementById('syllabus-drawer');
  const syllabusCloseBtn = document.getElementById('syllabus-close-btn');
  const syllabusDismissBtn = document.getElementById('syllabus-dismiss-btn');
  const syllabusEnrollBtn = document.getElementById('syllabus-enroll-btn');
  const syllabusBtnTriggers = document.querySelectorAll('.program-syllabus-btn');

  const openSyllabusDrawer = (programId) => {
    const data = syllabusData[programId] || syllabusData['full-stack'];
    if (!syllabusDrawerOverlay || !data) return;

    // Populate header info
    const trackBadge = document.getElementById('syllabus-track-badge');
    const durationPill = document.getElementById('syllabus-duration-pill');
    const levelPill = document.getElementById('syllabus-level-pill');
    const titleEl = document.getElementById('syllabus-title');
    const taglineEl = document.getElementById('syllabus-tagline');
    const bodyEl = document.getElementById('syllabus-drawer-body');

    if (trackBadge) trackBadge.textContent = data.track;
    if (durationPill) durationPill.textContent = data.duration;
    if (levelPill) levelPill.textContent = data.level;
    if (titleEl) titleEl.textContent = data.title;
    if (taglineEl) taglineEl.textContent = data.tagline;

    if (syllabusEnrollBtn) {
      syllabusEnrollBtn.setAttribute('data-program', data.title);
      syllabusEnrollBtn.onclick = () => {
        closeSyllabusDrawer();
        const inquiryTypeSelect = document.getElementById('inquiry-type');
        if (inquiryTypeSelect) inquiryTypeSelect.value = 'training';
        const messageContent = document.getElementById('message-content');
        if (messageContent && !messageContent.value) {
          messageContent.value = `I would like to inquire about the ${data.title} curriculum and upcoming batch schedule.`;
        }
      };
    }

    // Build Drawer Body Content
    if (bodyEl) {
      bodyEl.innerHTML = `
        <!-- Modules Roadmap -->
        <div class="syllabus-modules-section">
          <div class="syllabus-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Weekly Curriculum Roadmap</span>
          </div>
          <div class="syllabus-timeline">
            ${data.modules.map(mod => `
              <div class="syllabus-module-card">
                <div class="module-header">
                  <h4 class="module-title">${mod.title}</h4>
                  <span class="module-weeks-badge">${mod.weeks}</span>
                </div>
                <ul class="module-topics-list">
                  ${mod.topics.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Capstone Projects -->
        <div class="syllabus-capstones-section">
          <div class="syllabus-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Hands-on Capstone Projects</span>
          </div>
          <div class="syllabus-capstone-box">
            <div class="capstone-list">
              ${data.capstones.map(cap => `
                <div class="capstone-item">
                  <span class="capstone-icon">${cap.icon}</span>
                  <div>
                    <strong>${cap.title}</strong>
                    <p style="margin: 2px 0 0 0; font-size: 0.82rem; color: var(--color-text-muted);">${cap.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Technologies & Tools -->
        <div class="syllabus-tools-section">
          <div class="syllabus-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span>Tools & Tech Stack</span>
          </div>
          <div class="syllabus-tools-grid">
            ${data.tools.map(tool => `<span class="syllabus-tool-tag">${tool}</span>`).join('')}
          </div>
        </div>

        <!-- Target Roles -->
        <div class="syllabus-roles-section">
          <div class="syllabus-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            <span>Career Roles & Outcomes</span>
          </div>
          <div class="syllabus-roles-grid">
            ${data.roles.map(role => `<span class="syllabus-role-chip">${role}</span>`).join('')}
          </div>
        </div>
      `;
    }

    syllabusDrawerOverlay.classList.add('active');
    syllabusDrawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeSyllabusDrawer = () => {
    if (!syllabusDrawerOverlay) return;
    syllabusDrawerOverlay.classList.remove('active');
    syllabusDrawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (syllabusBtnTriggers.length) {
    syllabusBtnTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const progId = btn.getAttribute('data-syllabus');
        openSyllabusDrawer(progId);
      });
    });
  }

  if (syllabusCloseBtn) syllabusCloseBtn.addEventListener('click', closeSyllabusDrawer);
  if (syllabusDismissBtn) syllabusDismissBtn.addEventListener('click', closeSyllabusDrawer);

  if (syllabusDrawerOverlay) {
    syllabusDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === syllabusDrawerOverlay) {
        closeSyllabusDrawer();
      }
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (syllabusDrawerOverlay && syllabusDrawerOverlay.classList.contains('active')) {
        closeSyllabusDrawer();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 15. 1-ON-1 CAREER COUNSELING & DEMO CALL BOOKING CONTROLLER
  // --------------------------------------------------------------------------
  const tabInquiryBtn = document.getElementById('tab-inquiry-btn');
  const tabBookingBtn = document.getElementById('tab-booking-btn');
  const inquiryFormView = document.getElementById('inquiry-form-view');
  const bookingScheduleView = document.getElementById('booking-schedule-view');

  const switchContactTab = (tabName) => {
    if (!tabInquiryBtn || !tabBookingBtn || !inquiryFormView || !bookingScheduleView) return;

    if (tabName === 'booking') {
      tabInquiryBtn.classList.remove('active');
      tabInquiryBtn.setAttribute('aria-selected', 'false');
      tabBookingBtn.classList.add('active');
      tabBookingBtn.setAttribute('aria-selected', 'true');

      inquiryFormView.style.display = 'none';
      inquiryFormView.classList.remove('active');
      bookingScheduleView.style.display = 'block';
      bookingScheduleView.classList.add('active');
    } else {
      tabBookingBtn.classList.remove('active');
      tabBookingBtn.setAttribute('aria-selected', 'false');
      tabInquiryBtn.classList.add('active');
      tabInquiryBtn.setAttribute('aria-selected', 'true');

      bookingScheduleView.style.display = 'none';
      bookingScheduleView.classList.remove('active');
      inquiryFormView.style.display = 'block';
      inquiryFormView.classList.add('active');
    }
  };

  if (tabInquiryBtn) tabInquiryBtn.addEventListener('click', () => switchContactTab('inquiry'));
  if (tabBookingBtn) tabBookingBtn.addEventListener('click', () => switchContactTab('booking'));

  // Hero Booking button trigger
  const heroBookBtn = document.getElementById('hero-book-btn');
  if (heroBookBtn) {
    heroBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchContactTab('booking');
      const target = document.querySelector('.contact-form-panel') || document.getElementById('contact');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Dynamic Date Generator for Upcoming 6 Working Days
  const bookingDatesRow = document.getElementById('booking-dates-row');
  const selectedBookingDateInput = document.getElementById('selected-booking-date');

  const generateBookingDates = () => {
    if (!bookingDatesRow) return;
    bookingDatesRow.innerHTML = '';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let dateCount = 0;
    let currentCheck = new Date();
    // Start from tomorrow
    currentCheck.setDate(currentCheck.getDate() + 1);

    const generatedDates = [];

    while (dateCount < 6) {
      // Skip Sundays (0) for corporate mentorship
      if (currentCheck.getDay() !== 0) {
        const dayName = days[currentCheck.getDay()];
        const dateNum = currentCheck.getDate();
        const monthName = months[currentCheck.getMonth()];
        const fullDateStr = `${dayName}, ${monthName} ${dateNum}, ${currentCheck.getFullYear()}`;

        generatedDates.push({
          day: dayName.toUpperCase(),
          num: dateNum,
          month: monthName,
          full: fullDateStr
        });
        dateCount++;
      }
      currentCheck.setDate(currentCheck.getDate() + 1);
    }

    generatedDates.forEach((d, idx) => {
      const dateBtn = document.createElement('button');
      dateBtn.type = 'button';
      dateBtn.className = `booking-date-btn ${idx === 0 ? 'selected' : ''}`;
      dateBtn.setAttribute('data-full-date', d.full);
      dateBtn.innerHTML = `
        <span class="date-day-label">${d.day}</span>
        <span class="date-num-label">${d.num}</span>
        <span class="date-month-label">${d.month}</span>
      `;

      dateBtn.addEventListener('click', () => {
        document.querySelectorAll('.booking-date-btn').forEach(b => b.classList.remove('selected'));
        dateBtn.classList.add('selected');
        if (selectedBookingDateInput) selectedBookingDateInput.value = d.full;
        const err = document.getElementById('booking-date-error');
        if (err) err.style.display = 'none';
      });

      bookingDatesRow.appendChild(dateBtn);
    });

    // Default select first available date
    if (selectedBookingDateInput && generatedDates.length > 0) {
      selectedBookingDateInput.value = generatedDates[0].full;
    }
  };

  generateBookingDates();

  // Time Slot Selection Handler
  const slotButtons = document.querySelectorAll('.slot-pill');
  const selectedBookingSlotInput = document.getElementById('selected-booking-slot');

  if (slotButtons.length) {
    // Default select first slot
    slotButtons[0].classList.add('selected');
    if (selectedBookingSlotInput) selectedBookingSlotInput.value = slotButtons[0].getAttribute('data-slot');

    slotButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        slotButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (selectedBookingSlotInput) {
          selectedBookingSlotInput.value = btn.getAttribute('data-slot');
        }
        const err = document.getElementById('booking-slot-error');
        if (err) err.style.display = 'none';
      });
    });
  }

  // Booking Form Submission & Validation
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccessCard = document.getElementById('booking-success-card');
  const btnBookAnother = document.getElementById('btn-book-another');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const topicSelect = document.getElementById('booking-topic');
      const nameInput = document.getElementById('booking-name');
      const phoneInput = document.getElementById('booking-phone');
      const emailInput = document.getElementById('booking-email');
      const modeSelect = document.getElementById('booking-mode');

      let isValid = true;

      // Validate Topic
      if (!topicSelect || !topicSelect.value) {
        document.getElementById('booking-topic-error').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('booking-topic-error').style.display = 'none';
      }

      // Validate Date
      if (!selectedBookingDateInput || !selectedBookingDateInput.value) {
        document.getElementById('booking-date-error').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('booking-date-error').style.display = 'none';
      }

      // Validate Slot
      if (!selectedBookingSlotInput || !selectedBookingSlotInput.value) {
        document.getElementById('booking-slot-error').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('booking-slot-error').style.display = 'none';
      }

      // Validate Name
      if (!nameInput || nameInput.value.trim().length < 2) {
        document.getElementById('booking-name-error').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('booking-name-error').style.display = 'none';
      }

      // Validate Phone
      const phoneRegex = /^[+]?[\d\s\-()]{8,15}$/;
      if (!phoneInput || !phoneRegex.test(phoneInput.value.trim())) {
        document.getElementById('booking-phone-error').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('booking-phone-error').style.display = 'none';
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        document.getElementById('booking-email-error').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('booking-email-error').style.display = 'none';
      }

      if (!isValid) return;

      const submitBtn = document.getElementById('booking-submit-btn');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Simulate live calendar reservation
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        // Populate summary box
        const summaryDateTime = document.getElementById('summary-datetime');
        const summaryTopic = document.getElementById('summary-topic');
        const summaryMode = document.getElementById('summary-mode');

        if (summaryDateTime) {
          summaryDateTime.textContent = `${selectedBookingDateInput.value} • ${selectedBookingSlotInput.value}`;
        }
        if (summaryTopic) {
          summaryTopic.textContent = topicSelect.options[topicSelect.selectedIndex].text;
        }
        if (summaryMode) {
          summaryMode.textContent = modeSelect ? modeSelect.value : 'Google Meet Video Call';
        }

        bookingForm.style.display = 'none';
        if (bookingSuccessCard) {
          bookingSuccessCard.style.display = 'flex';
          bookingSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 650);
    });
  }

  if (btnBookAnother) {
    btnBookAnother.addEventListener('click', () => {
      if (bookingSuccessCard) bookingSuccessCard.style.display = 'none';
      if (bookingForm) {
        bookingForm.reset();
        bookingForm.style.display = 'block';
        generateBookingDates();
        if (slotButtons.length) {
          slotButtons.forEach(b => b.classList.remove('selected'));
          slotButtons[0].classList.add('selected');
          if (selectedBookingSlotInput) selectedBookingSlotInput.value = slotButtons[0].getAttribute('data-slot');
        }
      }
    });
  }

});

