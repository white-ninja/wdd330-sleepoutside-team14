// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getImageUrl(imagePath, baseUrl = '/') {
  if (typeof imagePath !== 'string' || !imagePath) {
    return null;
  }

  const imageRelativePath = imagePath.startsWith('../images/')
    ? imagePath.replace('../images/', 'images/')
    : imagePath.startsWith('/images/')
      ? imagePath.slice(1)
      : null;

  if (!imageRelativePath) {
    return imagePath;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${imageRelativePath}`;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(
      `Unable to load template at ${path}: ${response.status} ${response.statusText}`,
    );
  }
  return response.text();
}

export async function loadHeaderFooter(baseUrl = '/', callback) {
  const headerElement = qs('#main-header');
  const footerElement = qs('#main-footer');
  if (!headerElement || !footerElement) {
    throw new Error('The page is missing a header or footer placeholder.');
  }

  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate(`${baseUrl}partials/header.html`),
    loadTemplate(`${baseUrl}partials/footer.html`),
  ]);
  const replaceBaseUrl = (template) =>
    template.replace(/%BASE_URL%/g, baseUrl);

  renderWithTemplate(
    replaceBaseUrl(headerTemplate),
    headerElement,
    null,
    callback,
  );
  renderWithTemplate(replaceBaseUrl(footerTemplate), footerElement);
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// get a parameter from the URL query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
export function alertMessage(message, scroll = true) {
  const main = qs('main');
  if (!main) {
    throw new Error('Cannot display an alert because the page has no main element.');
  }

  const alert = document.createElement("div");
  alert.classList.add("alert-message");
  alert.setAttribute('role', 'alert');
  alert.setAttribute('aria-live', 'assertive');

  const alertText = document.createElement('p');
  alertText.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('close-alert');
  closeButton.setAttribute('aria-label', 'Dismiss message');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => alert.remove());

  alert.append(alertText, closeButton);
  main.prepend(alert);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return alert;
}
