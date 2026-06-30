const fs = require("fs");
const path = require("path");

let document;

beforeEach(() => {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  document = new DOMParser().parseFromString(html, "text/html");
});

describe("Hello World page — AC-1: displays correct content", () => {
  test('renders an h1 with text "Hello World"', () => {
    const h1 = document.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1.textContent.trim()).toBe("Hello World");
  });
});

describe("Hello World page — AC-2: responsive layout", () => {
  test("has viewport meta tag for mobile scaling", () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute("content")).toContain("width=device-width");
  });

  test("has a .container wrapper element", () => {
    const container = document.querySelector(".container");
    expect(container).not.toBeNull();
  });
});

describe("Hello World page — AC-3: no console errors (static HTML integrity)", () => {
  test("has charset UTF-8 declared", () => {
    const meta = document.querySelector('meta[charset]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute("charset").toUpperCase()).toBe("UTF-8");
  });

  test("has a non-empty page title", () => {
    const title = document.querySelector("title");
    expect(title).not.toBeNull();
    expect(title.textContent.trim().length).toBeGreaterThan(0);
  });
});
