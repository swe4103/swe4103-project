# Client

- React js framework is used to build the UI, all front end code will be stored under this directory
- Bootstrap CSS is used as the CSS framework for styling

## Directory Structure

- `public/`
  - Holds static assets like images, and favicons. These files are made available to the public, for example, a company logo used in a static header is a good example of what to store here.
- `src/`
  - Everything under here is not released to the public. (This is where we store the bulk of our code)
  - `assets/`
    - Holds assets that will be used by components. For example, images that are used inside of components should typically be stored in the src/ folder (e.g., in src/assets/).
  - `components/`
    - Responsible for holding reusable components (e.g., buttons, forms, cards). **Custom Components should ALWAYS start with a capitalized letter. This prevents React from getting confused with built-in components. Example: CustomButton.js not customButton.js**
  - `views/`
    - Page level components that represents routes in the app. A view will have multiple components to form a page. Example, SignIn view might have a form component with a button component.
  - `hooks/`
    - Custom React hooks that can be reused across components. See https://www.w3schools.com/react/react_customhooks.asp for a very simple example
  - `services/`
    - Handles interactions with external APIs, like our Express backend or third-party APIs (e.g., authentication services). For example, we will most probably have an apiClient.js file that handles creating an instance of axios which sets up config to avoid repetition every time we call our express backend.
  - `utils/`
    - Stores any useful helper methods that can be reused across the application
  - `config/`
    - Stores any configuration necessary for the front end
  - `state/`
    - Used to manage complex state to avoid "prop drilling". For example, storing the state of a user so we have access to know if they are logged in throughout the app.
