const API = 'http://localhost:3000/api';

let carsLoaded = [];

async function fetchCars() {
  try {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    if (data.success) {
      carsLoaded = data.cars.map(car => ({
        ...car,
        features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features
      }));
      return carsLoaded;
    }
  } catch (err) {
    console.warn('API not reachable, using static data.js');
    carsLoaded = carsData; // fallback
    return carsData;
  }
}

function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

function createCarCard(car) {
  const carIcons = { Sport:'🏎️', Luxury:'🚘', SUV:'🚙', Sedan:'🚗', Hatchback:'🚗' };
  const icon = carIcons[car.type] || '🚗';
  const badge = car.badge || car.badge_class ? `<span class="badge ${car.badge_class || ''}">${car.badge || ''}</span>` : '';
  const hp = car.horsepower || car.hp || 0;
  const price = Number(car.price) || 0;
  return `
    <div class="car-card" onclick="openModal(${car.id})">
      <div class="car-card-img">
        <div class="car-emoji">${icon}</div>
        ${badge}
      </div>
      <div class="car-card-body">
        <div class="car-brand">${car.brand} · ${car.year}</div>
        <h3 class="car-name">${car.name}</h3>
        <div class="car-specs">
          <span>⚡ ${hp}hp</span>
          <span>⛽ ${car.fuel}</span>
          <span>👥 ${car.seats} seats</span>
        </div>
        <div class="car-footer">
          <div class="car-price">$${price.toLocaleString()}</div>
          <button class="btn-details" onclick="event.stopPropagation(); openModal(${car.id})">View Details →</button>
        </div>
      </div>
    </div>
  `;
}

function openModal(carId) {
  const car = carsLoaded.find(c => c.id == carId);
  if (!car) return;

  const carIcons = { Sport:'🏎️', Luxury:'🚘', SUV:'🚙', Sedan:'🚗', Hatchback:'🚗' };
  const icon = carIcons[car.type] || '🚗';
  const badge = car.badge ? `<span class="badge ${car.badge_class || ''}">${car.badge}</span>` : '';
  const hp = car.horsepower || car.hp || 0;
  const price = Number(car.price) || 0;
  const mileageText = (car.mileage == 0 || car.mileage == null) ? 'Brand New' : Number(car.mileage).toLocaleString() + ' km';
  const features = typeof car.features === 'string' ? JSON.parse(car.features) : (car.features || []);

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-hero">
      <div class="modal-emoji">${icon}</div>
      <div class="modal-header-info">
        <span class="car-brand">${car.brand} · ${car.year}</span>
        <h2>${car.name}</h2>
        <div class="modal-price">$${price.toLocaleString()}</div>
        ${badge}
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-desc">
        <h4>About This Car</h4>
        <p>${car.description || ''}</p>
      </div>
      <div class="modal-specs-grid">
        <h4>Specifications</h4>
        <div class="spec-grid">
          <div class="spec-item"><span class="spec-label">Engine</span><span class="spec-val">${car.engine || '-'}</span></div>
          <div class="spec-item"><span class="spec-label">Horsepower</span><span class="spec-val">${hp} hp</span></div>
          <div class="spec-item"><span class="spec-label">Transmission</span><span class="spec-val">${car.transmission || '-'}</span></div>
          <div class="spec-item"><span class="spec-label">Fuel Type</span><span class="spec-val">${car.fuel || '-'}</span></div>
          <div class="spec-item"><span class="spec-label">Color</span><span class="spec-val">${car.color || '-'}</span></div>
          <div class="spec-item"><span class="spec-label">Mileage</span><span class="spec-val">${mileageText}</span></div>
          <div class="spec-item"><span class="spec-label">Seats</span><span class="spec-val">${car.seats}</span></div>
          <div class="spec-item"><span class="spec-label">Type</span><span class="spec-val">${car.type}</span></div>
        </div>
      </div>
      <div class="modal-features">
        <h4>Key Features</h4>
        <ul class="features-list">
          ${features.map(f => `<li>✓ ${f}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-actions">
        <a href="contact.html?car=${car.id}" class="btn-primary">Book a Test Drive</a>
        <a href="contact.html?car=${car.id}&subject=inquiry" class="btn-ghost-dark">Inquire About Price</a>
      </div>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.car-card, .why-card, .value-card, .team-card, .testimonial-card').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
});