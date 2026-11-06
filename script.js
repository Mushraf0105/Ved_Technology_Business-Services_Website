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

});

