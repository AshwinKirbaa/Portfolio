const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const clock = document.querySelector('#clock');
const updateClock = () => {
  clock.textContent = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date()) + ' IST';
};
updateClock();
setInterval(updateClock, 30000);
document.querySelector('#year').textContent = new Date().getFullYear();
