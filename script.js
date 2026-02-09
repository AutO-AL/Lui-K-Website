// Stagger reveal delays so sections animate in sequence even if markup changes.
const sections = document.querySelectorAll(".reveal");
sections.forEach((el, index) => {
  el.style.animationDelay = `${index * 120}ms`;
});

const bookingForm = document.getElementById("booking-form");
const bookingStatus = document.getElementById("booking-status");

if (bookingForm && bookingStatus) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingStatus.textContent = "Thanks. Your enquiry has been received and we'll get back to you soon.";
    bookingForm.reset();
  });
}
