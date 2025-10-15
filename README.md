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