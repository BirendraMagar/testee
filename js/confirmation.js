document.addEventListener("DOMContentLoaded", function () {
  // Get booking data from sessionStorage
  const bookingDataStr = sessionStorage.getItem("bookingData");

  if (bookingDataStr) {
    const bookingData = JSON.parse(bookingDataStr);

    // Update the page with booking data
    updateConfirmationPage(bookingData);

    sessionStorage.removeItem("bookingData");
  } else {
    // If no booking data found, show default message or redirect
    console.log("No booking data found.");
    window.location.href = "booking.html";
  }
});

// Update confirmation page with booking data
function updateConfirmationPage(data) {
  // Update title with first name if available
  if (data.name) {
    const firstName = data.name.split(" ")[0];
    const titleElement = document.getElementById("confirmation-title");
    if (titleElement) {
      titleElement.textContent = `Thank You, ${firstName}!`;
    }
  }

  // Update appointment details
  if (data.service) {
    const serviceElement = document.getElementById("conf-service");
    if (serviceElement) {
      serviceElement.textContent = data.service;
    }
  }

  if (data.date && data.time) {
    const datetimeElement = document.getElementById("conf-datetime");
    if (datetimeElement) {
      datetimeElement.textContent = `${data.date} at ${data.time}`;
    }
  }

  if (data.dentist) {
    const dentistElement = document.getElementById("conf-dentist");
    if (dentistElement) {
      dentistElement.textContent = data.dentist;
    }
  }

  if (data.name) {
    const patientElement = document.getElementById("conf-patient");
    if (patientElement) {
      patientElement.textContent = data.name;
    }
  }

  if (data.email) {
    const emailElement = document.getElementById("conf-email");
    if (emailElement) {
      emailElement.textContent = data.email;
    }
  }
}
