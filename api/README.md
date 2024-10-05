# API

- Backend Express.js API Server
- Created following [How to structure an Express.js REST API with best practices](https://blog.treblle.com/egergr/)

## Directory Structure

- `__tests__`
  - Test files for api tests
- `app/`
  - Application code for server
  - `config/`
    - Configuration for setting up and running the API
  - `controllers/`
    - The methods that process an endpoint and unpack web layer data to dispatch to services. Uses models to interact with external services like the database
  - `middleware/`
    - Reusable plugins to modify requests typically used for cache control, authentication, error handling, etc.
  - `models/`
    - Models for operations on resource. Interacts directly with the databse for operations on specific resources.
  - `routes/`
    - Declares the path of API endpoints and assigns to controllers
  - `services/`
    - Handles business logic and interacts with data sources or external APIs (like our database)
- `jest/`
  - Jest configuration for setup and teardown hooks
- `spec/`
  - OpenAPI specification for API design
