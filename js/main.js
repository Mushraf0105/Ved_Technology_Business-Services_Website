/**
 * ============================================================================
 * VEDA TECHNOLOGY - BUSINESS & SERVICES WEBSITE
 * Vanilla JavaScript (ES6+ / No external libraries or dependencies)
 * Features:
 *   1. Responsive Mobile Navigation (Accessible Hamburger Drawer)
 *   2. Sticky Header with Scroll Shadow
 *   3. Active Navigation Scroll Spy
 *   4. Technology Program Category Filtering
 *   5. Accessible FAQ Accordion
 *   6. Contact & Application Form Validation with Feedback Alert
 *   7. Quick Action Program/Internship Pre-Selection Handlers
 *   8. Floating Back-to-Top Button
 * ============================================================================
 */

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
  // 4. TECHNOLOGY PROGRAMS CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  if (filterButtons.length && programCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active tab button style
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        const filterValue = button.getAttribute('data-filter');

        // Show/hide matching cards
        programCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
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

});
