export default class Alert {
  constructor(mainElement, baseUrl = '/') {
    this.mainElement = mainElement;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  async init() {
    const alertsUrl = `${this.baseUrl}json/alerts.json`;
    const response = await fetch(alertsUrl);
    if (!response.ok) {
      throw new Error(`Unable to load alerts: ${response.status}`);
    }

    const alerts = await response.json();
    if (!Array.isArray(alerts)) {
      throw new Error('The alerts file must contain an array.');
    }
    if (alerts.length === 0) {
      return;
    }

    const alertList = document.createElement('section');
    alertList.className = 'alert-list';

    alerts.forEach((alert) => {
      if (
        typeof alert.message !== 'string' ||
        typeof alert.background !== 'string' ||
        typeof alert.color !== 'string'
      ) {
        throw new Error('Each alert must include a message, background, and color.');
      }

      const message = document.createElement('p');
      message.textContent = alert.message;
      message.style.backgroundColor = alert.background;
      message.style.color = alert.color;
      alertList.append(message);
    });

    this.mainElement.prepend(alertList);
  }
}
