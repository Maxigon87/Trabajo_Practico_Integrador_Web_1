document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initContactForm();
});

function initCarousel() {
  const imageElement = document.querySelector('[data-carousel-image]');
  if (!imageElement) return;

  const images = [
    'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'
  ];

  let index = 0;
  const indicatorsContainer = document.querySelector('[data-carousel-indicators]');
  indicatorsContainer.innerHTML = '';

  images.forEach((_, position) => {
    const dot = document.createElement('span');
    if (position === index) dot.classList.add('active');
    dot.addEventListener('click', () => {
      index = position;
      updateCarousel();
    });
    indicatorsContainer.appendChild(dot);
  });

  document.querySelector('[data-carousel-prev]').addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    updateCarousel();
  });

  document.querySelector('[data-carousel-next]').addEventListener('click', () => {
    index = (index + 1) % images.length;
    updateCarousel();
  });

  function updateCarousel() {
    imageElement.src = images[index];
    imageElement.alt = `Destino ${index + 1}`;
    indicatorsContainer.querySelectorAll('span').forEach((dot, position) => {
      dot.classList.toggle('active', position === index);
    });
  }

  updateCarousel();
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const feedback = document.querySelector('[data-feedback]');
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const phoneInput = form.querySelector('#phone');
  const messageInput = form.querySelector('#message');

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^\+?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{4}$/;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessages(form, feedback);

    let hasError = false;

    const nameValue = nameInput.value.trim();
    if (!nameValue) {
      showError(nameInput, 'El nombre es obligatorio.');
      hasError = true;
    } else if (nameValue.length > 50) {
      showError(nameInput, 'El nombre debe tener hasta 50 caracteres.');
      hasError = true;
    }

    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      showError(emailInput, 'El correo es obligatorio.');
      hasError = true;
    } else if (!emailPattern.test(emailValue)) {
      showError(emailInput, 'Ingrese un correo válido.');
      hasError = true;
    }

    const phoneValue = phoneInput.value.trim();
    if (!phoneValue) {
      showError(phoneInput, 'El teléfono es obligatorio.');
      hasError = true;
    } else if (!phonePattern.test(phoneValue)) {
      showError(phoneInput, 'Ingrese un teléfono válido.');
      hasError = true;
    }

    const messageValue = messageInput.value.trim();
    if (messageValue.length > 300) {
      showError(messageInput, 'El mensaje debe tener hasta 300 caracteres.');
      hasError = true;
    }

    if (hasError) return;

    const container = document.createElement('div');
    container.className = 'success-message';

    const title = document.createElement('h3');
    title.textContent = '¡Gracias por contactarte!';
    container.appendChild(title);

    const nameLine = document.createElement('p');
    nameLine.textContent = `Nombre: ${nameValue}`;
    container.appendChild(nameLine);

    const emailLine = document.createElement('p');
    emailLine.textContent = `Email: ${emailValue}`;
    container.appendChild(emailLine);

    const phoneLine = document.createElement('p');
    phoneLine.textContent = `Teléfono: ${phoneValue}`;
    container.appendChild(phoneLine);

    if (messageValue) {
      const messageLine = document.createElement('p');
      messageLine.textContent = `Mensaje: ${messageValue}`;
      container.appendChild(messageLine);
    }

    feedback.appendChild(container);
    form.reset();
  });
}

function showError(input, message) {
  input.classList.add('field-error');
  const error = document.createElement('p');
  error.className = 'error-message';
  error.textContent = message;
  input.insertAdjacentElement('afterend', error);
}

function clearMessages(form, feedback) {
  form.querySelectorAll('.error-message').forEach((element) => element.remove());
  form.querySelectorAll('.field-error').forEach((field) => field.classList.remove('field-error'));
  feedback.innerHTML = '';
}
