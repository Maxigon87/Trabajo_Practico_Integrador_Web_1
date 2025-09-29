document.addEventListener('DOMContentLoaded', () => {

  highlightActiveLink();
  initializeCarousel();
  setupContactForm();
});

function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (href === 'index.html' && currentPage === '')) {
      link.classList.add('active');
    }
  });
}

function initializeCarousel() {
  const carouselImage = document.querySelector('[data-carousel-image]');
  if (!carouselImage) return;


  const images = [
    'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',

    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1522199994204-aca47d849d6d?auto=format&fit=crop&w=1600&q=80'
  ];

  let currentIndex = 0;
  const indicatorsContainer = document.querySelector('[data-carousel-indicators]');

  images.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.dataset.index = index;
    indicatorsContainer.appendChild(indicator);
  });

  const indicators = indicatorsContainer.querySelectorAll('span');

  function renderImage(index) {
    carouselImage.src = images[index];
    carouselImage.alt = `Imagen destacada ${index + 1}`;
    indicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle('active', indicatorIndex === index);
    });
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    renderImage(currentIndex);
  }

  function previousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    renderImage(currentIndex);
  }

  document
    .querySelector('[data-carousel-next]')
    .addEventListener('click', () => nextImage());
  document
    .querySelector('[data-carousel-prev]')
    .addEventListener('click', () => previousImage());

  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      currentIndex = Number(indicator.dataset.index);
      renderImage(currentIndex);
    });
  });

  renderImage(currentIndex);
}

function setupContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const nameField = form.querySelector('#name');
  const emailField = form.querySelector('#email');
  const phoneField = form.querySelector('#phone');
  const messageField = form.querySelector('#message');
  const feedbackContainer = document.querySelector('[data-feedback]');

  const validators = {
    name: {
      required: true,
      maxLength: 50,
      message: 'El nombre es obligatorio y debe tener menos de 50 caracteres.'
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Ingrese un correo electrónico válido (ej: nombre@dominio.com).'
    },
    phone: {
      required: true,
      pattern: /^\+?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{4}$/,
      message: 'Ingrese un teléfono válido con código de país o área.'
    },
    message: {
      required: false,
      maxLength: 300,
      message: 'El mensaje no debe superar los 300 caracteres.'
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(form);
    feedbackContainer.innerHTML = '';

    const formData = new FormData(form);
    const errors = {};

    for (const [field, value] of formData.entries()) {
      const rules = validators[field];
      if (!rules) continue;

      const trimmedValue = value.trim();

      if (rules.required && trimmedValue.length === 0) {
        errors[field] = 'Este campo es obligatorio.';
        continue;
      }

      if (rules.maxLength && trimmedValue.length > rules.maxLength) {
        errors[field] = rules.message;
        continue;
      }

      if (rules.pattern && trimmedValue && !rules.pattern.test(trimmedValue)) {
        errors[field] = rules.message;
      }
    }

    if (Object.keys(errors).length > 0) {
      displayErrors(form, errors);
      return;
    }

    const submittedData = document.createElement('div');
    submittedData.classList.add('success-message');
    submittedData.innerHTML = `
      <h3>¡Gracias por contactarte!</h3>
      <p><strong>Nombre:</strong> ${nameField.value.trim()}</p>
      <p><strong>Email:</strong> ${emailField.value.trim()}</p>
      <p><strong>Teléfono:</strong> ${phoneField.value.trim()}</p>
      ${messageField.value.trim() ? `<p><strong>Mensaje:</strong> ${messageField.value.trim()}</p>` : ''}
    `;
    feedbackContainer.appendChild(submittedData);

    form.reset();
  });
}


function clearErrors(form) {
  form.querySelectorAll('.error-message').forEach((message) => message.remove());
  form.querySelectorAll('.field-error').forEach((field) => field.classList.remove('field-error'));
}

function displayErrors(form, errors) {
  Object.entries(errors).forEach(([fieldName, message]) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    field.classList.add('field-error');
    const errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    field.insertAdjacentElement('afterend', errorElement);
  });

}
