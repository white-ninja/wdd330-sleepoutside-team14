# BYU-Pathway Worldwide Online

## WDD 330 - Web Frontend Development II

### ⛺ SleepOutside Starter Code

- This repository is the start of the SleepOutside web application project for WDD 330. The repository contains branches which are checkpoints for the team and individual assignments throughout the course.

- <https://byui-cse.github.io/wdd330-ww-course/week01/team.html>

### Prerequisites

- You must have Node installed to run the following commands.
  [WDD 330 Setup Environment](https://byui-cse.github.io/wdd330-ww-course/intro/)

### Common Workflow Commands

- `npm run lint` to run ESLint against your code to find errors.
- `npm run format` to run Prettier to automatically format your code.
- `npm run start` starts up a local server and updates on any JS or CSS/SCSS
- `npm run build` to build final files when you are ready to turn in.
- `npm run preview` serves the production build locally after running `npm run build`.

### Deployment

The site deploys to GitHub Pages from the `main` branch through the GitHub Actions workflow. In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**. The workflow runs lint, tests, and a production build before publishing `dist`.

For local production builds, run `npm run build` and `npm run preview`. The GitHub Actions build automatically uses the repository's Pages base path.

### Product catalog API

The home page links to dynamic listings for tents, backpacks, sleeping bags, and hammocks. Product listings and detail pages use the WDD 330 backend API. For local development, copy `src/.env.sample` to `src/.env` and set `VITE_SERVER_URL` to the backend URL. The public course API URL is used as a fallback when that variable is not set, including in the GitHub Pages build.

---

_BYU-Pathway Worldwide improves lives through access to spiritually based, online affordable higher education. Its mission is to develop disciples of Jesus Christ who are leaders in their homes, the Church, and their communities._
