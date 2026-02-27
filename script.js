/* ============================================================
   PORTFOLIO — script.js
   Anuja Bhatta
   Features:
   - Dark / Light theme toggle (persisted in localStorage)
   - Sticky navbar shadow on scroll
   - Active nav link highlight on scroll
   - Hamburger mobile menu
   - Smooth scroll for all nav links
   - Scroll reveal animation
   - Animated skill bars on scroll
   - Project filter by category
   - Contact form validation
   - CV download (links to actual PDF)
   - Toast notification helper
============================================================ */

/* ============================================================
   1. THEME TOGGLE
============================================================ */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

/* Load saved theme on page load */
(function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    root.setAttribute("data-theme", "dark");
    themeIcon.textContent = "Light Mode";
  } else {
    root.setAttribute("data-theme", "light");
    themeIcon.textContent = "Dark Mode";
  }
})();

themeToggle.addEventListener("click", function () {
  const current = root.getAttribute("data-theme");

  if (current === "dark") {
    root.setAttribute("data-theme", "light");
    themeIcon.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
    showToast("Light mode enabled");
  } else {
    root.setAttribute("data-theme", "dark");
    themeIcon.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
    showToast("Dark mode enabled");
  }
});

/* ============================================================
   2. NAVBAR — SCROLL SHADOW + ACTIVE LINK
============================================================ */
const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", function () {
  /* Navbar shadow */
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  /* Active nav link */
  let current = "";
  sections.forEach(function (section) {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

/* ============================================================
   3. SMOOTH SCROLL — NAVBAR + MOBILE MENU
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    /* Ignore plain "#" links */
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({ behavior: "smooth" });

    /* Close mobile menu if open */
    mobileMenu.classList.remove("open");
  });
});

/* ============================================================
   4. HAMBURGER MOBILE MENU
============================================================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", function () {
  mobileMenu.classList.toggle("open");
});

/* Close menu when clicking outside */
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove("open");
  }
});

/* ============================================================
   5. SCROLL REVEAL ANIMATION
============================================================ */
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach(function (el) {
  revealObserver.observe(el);
});

/* ============================================================
   6. ANIMATED SKILL BARS
============================================================ */
const skillObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".skill-fill");
        fills.forEach(function (fill) {
          const level = fill.getAttribute("data-level");
          fill.style.width = level + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

const skillsSection = document.querySelector(".skills-wrap");
if (skillsSection) {
  skillObserver.observe(skillsSection);
}

/* ============================================================
   7. PROJECT FILTER
============================================================ */
const filterBtns = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    /* Update active state */
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
    });
    this.classList.add("active");

    const filter = this.getAttribute("data-filter");

    projects.forEach(function (project) {
      const category = project.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        project.classList.remove("hidden");
      } else {
        project.classList.add("hidden");
      }
    });
  });
});

/* ============================================================
   8. CONTACT FORM VALIDATION
============================================================ */
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const agreeInput = document.getElementById("agree");
const submitBtn = document.getElementById("submitBtn");
const formSuccess = document.getElementById("formSuccess");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const agreeError = document.getElementById("agreeError");

/* Clear error on input */
[nameInput, emailInput, messageInput].forEach(function (input) {
  input.addEventListener("input", function () {
    clearError(input);
  });
});

agreeInput.addEventListener("change", function () {
  agreeError.textContent = "";
});

function setError(input, errorEl, message) {
  input.classList.add("input-error");
  errorEl.textContent = message;
}

function clearError(input) {
  input.classList.remove("input-error");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  /* Reset errors */
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  agreeError.textContent = "";
  clearError(nameInput);
  clearError(emailInput);
  clearError(messageInput);
  formSuccess.classList.remove("show");

  /* Validate Name */
  if (nameInput.value.trim() === "") {
    setError(nameInput, nameError, "Full name is required.");
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    setError(nameInput, nameError, "Name must be at least 2 characters.");
    isValid = false;
  }

  /* Validate Email */
  if (emailInput.value.trim() === "") {
    setError(emailInput, emailError, "Email address is required.");
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    setError(emailInput, emailError, "Please enter a valid email address.");
    isValid = false;
  }

  /* Validate Message */
  if (messageInput.value.trim() === "") {
    setError(messageInput, messageError, "Message is required.");
    isValid = false;
  } else if (messageInput.value.trim().length < 10) {
    setError(
      messageInput,
      messageError,
      "Message must be at least 10 characters.",
    );
    isValid = false;
  }

  /* Validate Checkbox */
  if (!agreeInput.checked) {
    agreeError.textContent = "Please confirm the information is correct.";
    isValid = false;
  }

  if (!isValid) return;

  /* Simulate sending */
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  setTimeout(function () {
    submitBtn.textContent = "Send Message";
    submitBtn.disabled = false;
    contactForm.reset();
    formSuccess.classList.add("show");
    showToast("Message sent successfully!");
  }, 1500);
});

/* ============================================================
   9. CV DOWNLOAD
   Links to the actual uploaded PDF file
============================================================ */
function downloadCV() {
  const link = document.createElement("a");
  link.href = "my_cv.pdf";
  link.download = "Anuja_Bhatta_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Downloading CV...");
}

const downloadBtn1 = document.getElementById("downloadCvBtn");
const downloadBtn2 = document.getElementById("downloadCvBtn2");

if (downloadBtn1) {
  downloadBtn1.addEventListener("click", downloadCV);
}

if (downloadBtn2) {
  downloadBtn2.addEventListener("click", downloadCV);
}

/* ============================================================
   10. TOAST NOTIFICATION
============================================================ */
const toastEl = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toastEl.classList.remove("show");
  }, 3000);
}

/* ============================================================
   INIT LOG
============================================================ */
console.log("Portfolio script loaded.");
