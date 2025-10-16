# Project "RSS Reader":
[![Actions Status](https://github.com/sobolevaea/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/sobolevaea/frontend-project-11/actions)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=sobolevaea_frontend-project-11&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=sobolevaea_frontend-project-11)

## Description
An RSS aggregator that allows you to read all your favorite news feeds in one place.
The project showcases modern frontend development practices:
- Architecture: MVC pattern with clear separation of concerns
- State Management: Reactive state updates using onChange listeners
- API Communication: Asynchronous requests with proxy for RSS fetching
- Validation: Schema-based validation with Yup
- Internationalization: i18next for easy text management and multi-language support
- Utilities: Lodash for optimized data manipulation
- UI Framework: Bootstrap 5 for responsive component design
- Build Tool: Vite for module bundling and optimization

## Getting started

Follow these steps to set up the project locally:

- Clone the repository

```bash
git clone git@github.com:sobolevaea/frontend-project-11.git
```
```bash
cd frontend-project-11
```

- Install dependencies

```bash
make install
```

- Start the development server

```bash
make run
```
The application will open in your browser at http://localhost:5173 (or another available port).

- Build for production

```bash
make build
```
This creates an optimized production build in the dist folder.

- Preview production build

```bash
make preview
```
This serves the production build locally for testing.

## Other useful tools

- Run linter check

```bash
  make lint
```

- Fix warnings

```bash
  make fix
```

## How to Use
1. Go to the [**main application page**](https://frontend-project-11-rss-six.vercel.app/).
2. Paste the link to your favorite RSS feed in the input field.
   - Example of a valid RSS feed: https://ru.hexlet.io/blog.rss
3. Click the "**Add**" button.
4. That's it! The feed is added to your list. Now you can:
    - View the list of all added feeds (sources).
    - See the list of posts from each feed.
    - Click on a post to read its summary in a modal window.
    - Navigate to the full article via the "Read more" link.

New posts will be loaded automatically.