if (!hamburger || !nav) return;
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mainNav");
const statsSection = document.getElementById("statsSection");
const counters = document.querySelectorAll(".count");
const singleSubscription = document.getElementById("singleSubscription");
const doubleSubscription = document.getElementById("doubleSubscription");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("open");
  document.body.classList.toggle("no-scroll");
});
hamburger.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    hamburger.click();
  }
});


nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("no-scroll");
  });
});


/* Gallery */
const images = [
  "assets/images/p1.jpg",
  "assets/images/p2.jpg",
  "assets/images/p3.jpg"
];

let currentIndex = 0;

const mainImg = document.getElementById("mainProductImage");
const dotsContainer = document.getElementById("galleryDots");
const thumbnails = document.querySelectorAll(".thumbnails img");

function createDots() {
  dotsContainer.innerHTML = "";

  images.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.textContent = "•";
    dot.addEventListener("click", () => updateGallery(index));
    dotsContainer.appendChild(dot);
  });
}


function updateGallery(index) {
  currentIndex = index;
  mainImg.src = images[currentIndex];

  // Update dots
  const dots = document.querySelectorAll(".dot");
  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");

  // Update thumbnails
  thumbnails.forEach(t => t.classList.remove("active"));
  if (thumbnails[index]) thumbnails[index].classList.add("active");
}

document.getElementById("nextBtn").addEventListener("click", () => {
  updateGallery((currentIndex + 1) % images.length);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  updateGallery((currentIndex - 1 + images.length) % images.length);
});


thumbnails.forEach((thumb, index) => {
  thumb.addEventListener("click", () => {
    updateGallery(index);
  });
});



dots.forEach(dot => {
  dot.onclick = () => updateGallery(Number(dot.dataset.index));
});


createDots();
updateGallery(0);


/* Product Logic */
let basePrice = 799;
let multiplier = 1;
let quantity = 1;
const selection = {
  fragrance: document.querySelector('input[name="fragrance"]:checked').value,
  purchase: document.querySelector('input[name="purchase"]:checked').value
};
const cartLinks = {
  fresh_single: "#fresh-single",
  fresh_double: "#fresh-double",
  fresh_gift: "#fresh-gift",

  bold_single: "#bold-single",
  bold_double: "#bold-double",
  bold_gift: "#bold-gift",

  classic_single: "#classic-single",
  classic_double: "#classic-double",
  classic_gift: "#classic-gift"
};

const addToCart = document.getElementById("addToCart");

const priceEl = document.getElementById("price");
const qtyEl = document.getElementById("quantity");

function updatePrice() {
  priceEl.textContent = Math.round(basePrice * multiplier * quantity);
}
function updateCartLink() {
  const key = `${selection.fragrance}_${selection.purchase}`;
  addToCart.href = cartLinks[key];
}
function updateSubscriptionUI() {
  singleSubscription.classList.remove("active");
  doubleSubscription.classList.remove("active");

  if (selection.purchase === "single") {
    singleSubscription.classList.add("active");
  }

  if (selection.purchase === "double") {
    doubleSubscription.classList.add("active");
  }
}

/* Fragrance Buttons */
document.querySelectorAll('input[name="fragrance"]').forEach(radio => {
  radio.addEventListener('change', () => {
    basePrice = Number(radio.dataset.price);
    selection.fragrance = radio.value;
    updatePrice();
    updateCartLink();
  });
});



/* Purchase Type Buttons */
document.querySelectorAll('input[name="purchase"]').forEach(radio => {
  radio.addEventListener('change', () => {
    multiplier = Number(radio.dataset.multiplier);
    selection.purchase = radio.value;
    updatePrice();
    updateCartLink();
    updateSubscriptionUI();

  });
});


/* Quantity */
document.getElementById("plus").onclick = () => {
  quantity++;
  qtyEl.textContent = quantity;
  updatePrice();
};

document.getElementById("minus").onclick = () => {
  if (quantity > 1) {
    quantity--;
    qtyEl.textContent = quantity;
    updatePrice();
  }
};

/* Default selections */
updateCartLink();
updateSubscriptionUI();

function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let current = 0;

    const increment = Math.ceil(target / 60);

    const update = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = current;
        requestAnimationFrame(update);
      }
    };

    update();
  });
}

let statsAnimated = false;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      animateCounters();
      statsAnimated = true;
      observer.disconnect();
    }
  });
}, { threshold: 0.4 });

observer.observe(statsSection);
