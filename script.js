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

const socialTrack = document.querySelector(".social-track");
const socialCarousel = document.querySelector(".social-carousel");

let socialRafId;
let socialPositions = [];
let socialIconWidth = 0;
let socialTrackWidth = 0;
let socialLastTime = 0;
const socialSpeed = 72;
const socialGap = 12;
let socialPaused = false;

function renderSocialIcons(icons) {
  icons.forEach((icon, index) => {
    icon.style.transform = `translate3d(${socialPositions[index]}px, -50%, 0)`;
  });
}

function stepSocialCarousel(timestamp) {
  if (!socialTrack) return;
  const icons = Array.from(socialTrack.querySelectorAll(".icon-link"));
  if (icons.length < 2) return;

  if (!socialLastTime) socialLastTime = timestamp;
  const delta = Math.min(64, timestamp - socialLastTime) / 1000;
  socialLastTime = timestamp;

  if (!socialPaused) {
    for (let index = 0; index < socialPositions.length; index += 1) {
      socialPositions[index] += socialSpeed * delta;
      if (socialPositions[index] >= socialTrackWidth) {
        const otherPositions = socialPositions.filter((_, otherIndex) => otherIndex !== index);
        const minPosition = otherPositions.length ? Math.min(...otherPositions) : 0;
        const leftSpawn = -socialIconWidth;
        socialPositions[index] = Math.min(leftSpawn, minPosition - (socialIconWidth + socialGap));
      }
    }
  }

  renderSocialIcons(icons);
  socialRafId = window.requestAnimationFrame(stepSocialCarousel);
}

function setupSocialCarousel() {
  if (!socialTrack) return;
  const icons = Array.from(socialTrack.querySelectorAll(".icon-link"));
  if (icons.length < 2) return;

  window.cancelAnimationFrame(socialRafId);

  socialTrackWidth = socialTrack.clientWidth;
  socialIconWidth = icons[0].getBoundingClientRect().width || 60;
  socialPositions = icons.map((_, index) => -index * (socialIconWidth + socialGap));
  socialLastTime = 0;

  if (socialCarousel && !socialCarousel.dataset.pauseBound) {
    socialCarousel.addEventListener("mouseenter", () => {
      socialPaused = true;
    });
    socialCarousel.addEventListener("mouseleave", () => {
      socialPaused = false;
    });
    socialCarousel.dataset.pauseBound = "true";
  }

  renderSocialIcons(icons);
  socialRafId = window.requestAnimationFrame(stepSocialCarousel);
}

setupSocialCarousel();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setupSocialCarousel, 120);
});
