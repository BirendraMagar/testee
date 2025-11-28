// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

// Open menu
menuToggle.addEventListener("click", () => {
  mobileMenu.classList.add("active");
  menuOverlay.classList.add("active");
  menuToggle.classList.add("active");
  document.body.style.overflow = "hidden";
});

// Close menu
const closeMenu = () => {
  mobileMenu.classList.remove("active");
  menuOverlay.classList.remove("active");
  menuToggle.classList.remove("active");
  document.body.style.overflow = "";
};

menuClose.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

// Close menu when clicking a link
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-nav a");
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Set active page for BOTH desktop and mobile navigation
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Desktop navigation
const desktopNavLinks = document.querySelectorAll(".nav-menu a");
desktopNavLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// Mobile navigation
mobileMenuLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// Booking state
let bookingData = {
  currentStep: 1,
  service: "Check-up & Clean",
  date: null,
  time: null,
  dentist: "Dr. Johanna Grey",
  name: "",
  phone: "",
  email: "",
  notes: "",
  privacyAccepted: false,
};

// Calendar state
let currentDate = new Date(2025, 10, 1); // November 2025
let selectedDate = null;
let selectedTime = null;

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("calendar-days")) {
    generateCalendar();
    generateTimeSlots();
    updateSummary();

    // Add form input listeners
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("input", handleFormInput);
    }
  }
});

// Service Selection
function selectService(serviceName, element) {
  document.querySelectorAll(".booking-service-card").forEach((card) => {
    card.classList.remove("selected");
  });
  element.classList.add("selected");
  bookingData.service = serviceName;
  updateSummary();
}

// Calendar Functions
function generateCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("calendar-month").textContent =
    currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays = document.getElementById("calendar-days");
  calendarDays.innerHTML = "";

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarDays.innerHTML += `
            <div class="booking-calendar-day">
                <button class="booking-day-button disabled">${day}</button>
            </div>`;
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDateObj = new Date(year, month, day);
    currentDateObj.setHours(0, 0, 0, 0);

    const isPast = currentDateObj < today;
    const isSelected =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year;
    const selectedClass = isSelected ? "selected" : "";
    const disabledClass = isPast ? "disabled" : "";

    calendarDays.innerHTML += `
            <div class="booking-calendar-day">
                <button class="booking-day-button ${selectedClass} ${disabledClass}" 
                        onclick="selectDate(${year}, ${month}, ${day})" 
                        ${isPast ? "disabled" : ""}>
                    ${day}
                </button>
            </div>`;
  }
}

function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  generateCalendar();
}

function selectDate(year, month, day) {
  selectedDate = new Date(year, month, day);
  bookingData.date = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  generateCalendar();
  updateSummary();
}

// Time Slot Functions
function generateTimeSlots() {
  const timeSlots = document.getElementById("time-slots");
  const times = [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: false },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "12:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "02:30 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "03:30 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "04:30 PM", available: true },
    { time: "05:00 PM", available: true },
    { time: "05:30 PM", available: true },
    { time: "06:00 PM", available: true },
  ];

  timeSlots.innerHTML = "";
  times.forEach((slot) => {
    const disabledClass = !slot.available ? "disabled" : "";
    const selectedClass = selectedTime === slot.time ? "selected" : "";
    timeSlots.innerHTML += `
            <button class="booking-time-slot ${disabledClass} ${selectedClass}" 
                    onclick="selectTime('${slot.time}')" 
                    ${!slot.available ? "disabled" : ""}>
                ${slot.time}
            </button>`;
  });
}

function selectTime(time) {
  selectedTime = time;
  bookingData.time = time;
  generateTimeSlots();
  updateSummary();
}

// Dentist Selection
function selectDentist(name, specialty, element) {
  document.querySelectorAll(".booking-dentist-card").forEach((card) => {
    card.classList.remove("selected");
  });
  element.classList.add("selected");
  bookingData.dentist = name;
  updateSummary();
}

// Step Navigation
function toggleStep(stepNumber) {
  if (
    stepNumber <= bookingData.currentStep ||
    stepNumber === bookingData.currentStep + 1
  ) {
    goToStep(stepNumber);
  }
}

function goToStep(stepNumber) {
  // Hide all step contents
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step${i}`).classList.remove("active");
    document.getElementById(`step${i}`).classList.add("inactive");
    document.getElementById(`step${i}-content`).classList.remove("active");
    document.getElementById(`step${i}-icon`).textContent = "";

    if (i < stepNumber) {
      document.getElementById(`step${i}`).classList.add("completed");
      document.getElementById(`step${i}-number`).innerHTML =
        '<span class="material-symbols-outlined" style="font-size: 1rem;">check</span>';
      document.getElementById(`step${i}-number`).classList.add("active");
    } else if (i === stepNumber) {
      document
        .getElementById(`step${i}`)
        .classList.remove("inactive", "completed");
      document.getElementById(`step${i}-content`).classList.add("active");
      document.getElementById(`step${i}-icon`).textContent = "expand_less";
      document.getElementById(`step${i}-number`).textContent = i;
      document.getElementById(`step${i}-number`).classList.add("active");
    } else {
      document.getElementById(`step${i}-number`).textContent = i;
      document.getElementById(`step${i}-number`).classList.remove("active");
    }
  }

  bookingData.currentStep = stepNumber;

  // Update navigation buttons
  document.getElementById("prev-btn").disabled = stepNumber === 1;

  const nextBtn = document.getElementById("next-btn");
  if (stepNumber === 4) {
    nextBtn.textContent = "Confirm Booking";
  } else {
    nextBtn.textContent = "Next Step";
  }

  updateSummary();
}

function nextStep() {
  if (bookingData.currentStep < 4) {
    // Validate current step before proceeding
    if (
      bookingData.currentStep === 2 &&
      (!bookingData.date || !bookingData.time)
    ) {
      alert("Please select both a date and time before proceeding.");
      return;
    }
    goToStep(bookingData.currentStep + 1);
  } else {
    // Validate form
    const form = document.getElementById("contact-form");
    if (validateForm()) {
      bookingData.name = document.getElementById("full-name").value;
      bookingData.phone = document.getElementById("phone-number").value;
      bookingData.email = document.getElementById("email").value;
      bookingData.notes = document.getElementById("notes").value;
      bookingData.privacyAccepted =
        document.getElementById("privacy-policy").checked;
      updateSummary();
      confirmAppointment();
    } else {
      form.reportValidity();
    }
  }
}

function previousStep() {
  if (bookingData.currentStep > 1) {
    goToStep(bookingData.currentStep - 1);
  }
}

// Form Validation
function validateForm() {
  const form = document.getElementById("contact-form");
  const name = document.getElementById("full-name").value.trim();
  const phone = document.getElementById("phone-number").value.trim();
  const email = document.getElementById("email").value.trim();
  const privacy = document.getElementById("privacy-policy").checked;

  // Validate name
  if (name === "") {
    alert("Please enter your full name.");
    return false;
  }

  // Validate phone (Australian format)
  const phoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    alert("Please enter a valid Australian phone number.");
    return false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  // Validate privacy policy
  if (!privacy) {
    alert(
      "Please accept the Consent to receive appointment reminders and updates via email or SMS to continue."
    );
    return false;
  }

  return form.checkValidity();
}

// Handle Form Input
function handleFormInput() {
  bookingData.name = document.getElementById("full-name").value;
  bookingData.phone = document.getElementById("phone-number").value;
  bookingData.email = document.getElementById("email").value;
  bookingData.notes = document.getElementById("notes").value;
  bookingData.privacyAccepted =
    document.getElementById("privacy-policy").checked;
  updateSummary();
}

// Update Summary
function updateSummary() {
  document.getElementById("summary-service").textContent = bookingData.service;

  if (bookingData.date && bookingData.time) {
    document.getElementById(
      "summary-datetime"
    ).textContent = `${bookingData.date} at ${bookingData.time}`;
    document.getElementById("summary-datetime").classList.remove("pending");
  } else {
    document.getElementById("summary-datetime").textContent = "Pending...";
    document.getElementById("summary-datetime").classList.add("pending");
  }

  if (bookingData.dentist) {
    document.getElementById("summary-dentist").textContent =
      bookingData.dentist;
    document.getElementById("summary-dentist").classList.remove("pending");
  } else {
    document.getElementById("summary-dentist").textContent = "Pending...";
    document.getElementById("summary-dentist").classList.add("pending");
  }

  if (
    bookingData.name &&
    bookingData.email &&
    bookingData.phone &&
    bookingData.privacyAccepted
  ) {
    document.getElementById("summary-info").textContent = "Provided";
    document.getElementById("summary-info").classList.remove("pending");
  } else {
    document.getElementById("summary-info").textContent = "Pending...";
    document.getElementById("summary-info").classList.add("pending");
  }

  // Enable confirm button if all required fields are filled
  const allFieldsFilled =
    bookingData.service &&
    bookingData.date &&
    bookingData.time &&
    bookingData.dentist &&
    bookingData.name &&
    bookingData.email &&
    bookingData.phone &&
    bookingData.privacyAccepted;

  document.getElementById("confirm-btn").disabled = !allFieldsFilled;
}

// Confirm Appointment
function confirmAppointment() {
  // Store booking data in sessionStorage
  sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

  // Redirect to confirmation page
  window.location.href = "confirmation.html";
}
