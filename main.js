document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar Controller
  const header = document.querySelector('.site-header');
  const isInnerPage = header?.classList.contains('inner-page');

  window.addEventListener('scroll', () => {
    if (!isInnerPage && header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Intersection Observer Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-target').forEach(el => observer.observe(el));
});

// Helper: Card HTML Generator
function createProductCardHTML(p) {
  const isFixedUnit = !!p.unit;
  const initialPrice = isFixedUnit ? p.pricePerKg : Math.round((p.pricePerKg / 1000) * 500);
  const unitLabel = isFixedUnit ? p.unit : "for 500g";

  return `
    <article class="product-card fade-in-target" data-id="${p.id}" data-category="${p.category}">
      <div class="product-image-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=60'">
      </div>
      <div class="product-body">
        <div class="product-header-row">
          <h3 class="product-title">${p.name}</h3>
          <span class="product-urdu">${p.nameUrdu}</span>
        </div>
        <p class="product-desc">${p.description}</p>
        
        ${!isFixedUnit ? `
          <div class="weight-selector" data-id="${p.id}">
            <button type="button" class="weight-btn" data-weight="250">250g</button>
            <button type="button" class="weight-btn active" data-weight="500">500g</button>
            <button type="button" class="weight-btn" data-weight="1000">1kg</button>
          </div>
        ` : `<div style="height: 38px;"></div>`}

        <div class="product-price-row">
          <div class="product-price" id="price-display-${p.id}">Rs. ${initialPrice.toLocaleString()}</div>
          <div class="product-unit" id="unit-display-${p.id}">${unitLabel}</div>
        </div>

        <div class="product-card-actions">
          <button class="btn btn-primary" onclick="handleAddToCart(${p.id})">Add to Cart</button>
          <button class="btn btn-whatsapp" onclick="handleWhatsAppDirect(${p.id})">WhatsApp</button>
        </div>
      </div>
    </article>
  `;
}

// Global UI Handlers for Product Cards
function handleWeightSelect(productId, weightGrams, targetBtn) {
  const p = products.find(i => i.id === productId);
  if (!p || p.unit) return;

  const selector = targetBtn.closest('.weight-selector');
  selector.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
  targetBtn.classList.add('active');

  const calculatedPrice = Math.round((p.pricePerKg / 1000) * weightGrams);
  const label = weightGrams >= 1000 ? `${weightGrams / 1000}kg` : `${weightGrams}g`;

  document.getElementById(`price-display-${productId}`).textContent = `Rs. ${calculatedPrice.toLocaleString()}`;
  document.getElementById(`unit-display-${productId}`).textContent = `for ${label}`;
}

function handleAddToCart(productId) {
  const p = products.find(i => i.id === productId);
  if (!p) return;

  let selectedWeight = 1000;
  if (!p.unit) {
    const activeBtn = document.querySelector(`.weight-selector[data-id="${productId}"] .weight-btn.active`);
    selectedWeight = activeBtn ? parseInt(activeBtn.dataset.weight, 10) : 500;
  }

  window.cartManager.addToCart(p, selectedWeight, 1);
}

function handleWhatsAppDirect(productId) {
  const p = products.find(i => i.id === productId);
  if (!p) return;

  let weightLabel = p.unit || "500g";
  if (!p.unit) {
    const activeBtn = document.querySelector(`.weight-selector[data-id="${productId}"] .weight-btn.active`);
    const grams = activeBtn ? activeBtn.dataset.weight : 500;
    weightLabel = grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
  }

  const msg = `Hi Karakorum Harvest! 🏔️\nI want to order *${p.name}* (${weightLabel}).\nPlease confirm price and availability. Thank you!`;
  window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, '_blank');
}

// Attach dynamic event listener for weight selectors
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('weight-btn')) {
    const weight = parseInt(e.target.dataset.weight, 10);
    const productId = parseInt(e.target.closest('.weight-selector').dataset.id, 10);
    handleWeightSelect(productId, weight, e.target);
  }
});