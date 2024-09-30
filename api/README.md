# API

- Backend Express.js API Server. Created following [How to structure an Express.js REST API with best practices](https://blog.treblle.com/egergr/)

## Directory Structure

- `app/`
  - Application code for server
  - `controllers/`
    - The methods that process an endpoint and unpack web layer data to dispatch to services
  - `middleware/`
    - Reusable plugins to modify requests typically used for cache control, authentication, error handling, etc.
  - `routes/`
    - Declares the path of API endpoints and assigns to controllers
  - `services/`
    - Handles business logic and interacts with data sources or external APIs (like our database)
- `spec/`
  - OpenAPI specification for API design