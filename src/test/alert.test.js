import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Alert from '../js/Alert.js';

const originalDocument = global.document;

afterEach(() => {
  jest.restoreAllMocks();
  if (originalDocument === undefined) {
    delete global.document;
  } else {
    global.document = originalDocument;
  }
});

describe('Alert', () => {
  it('renders each alert and prepends the section to main', async () => {
    const alerts = [
      { message: 'Announcement one', background: 'darkblue', color: 'white' },
      { message: 'Announcement two', background: 'yellow', color: 'black' },
    ];
    const createElement = jest.fn((tagName) => ({
      tagName,
      style: {},
      children: [],
      append(child) {
        this.children.push(child);
      },
    }));
    global.document = { createElement };
    const main = { prepend: jest.fn() };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => alerts,
    });

    await new Alert(main, '/site/').init();

    expect(global.fetch).toHaveBeenCalledWith('/site/json/alerts.json');
    const section = main.prepend.mock.calls[0][0];
    expect(section.tagName).toBe('section');
    expect(section.className).toBe('alert-list');
    expect(section.children).toHaveLength(2);
    expect(section.children[0]).toMatchObject({
      tagName: 'p',
      textContent: 'Announcement one',
      style: { backgroundColor: 'darkblue', color: 'white' },
    });
    expect(section.children[1]).toMatchObject({
      tagName: 'p',
      textContent: 'Announcement two',
      style: { backgroundColor: 'yellow', color: 'black' },
    });
  });

  it('does not prepend an alert section when there are no alerts', async () => {
    global.document = { createElement: jest.fn() };
    const main = { prepend: jest.fn() };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await new Alert(main).init();

    expect(main.prepend).not.toHaveBeenCalled();
    expect(global.document.createElement).not.toHaveBeenCalled();
  });
});
