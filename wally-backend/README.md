# Wally Backend

Wally Backend is a Node.js application designed to provide a robust backend service for chat, product recommendations, and review management. This project utilizes MongoDB for data storage and integrates with Azure services for advanced functionalities.

## Project Structure

The project is organized into several key directories:

- **config/**: Contains configuration files for database connections, Azure services, and application-wide settings.
- **controllers/**: Houses the logic for handling requests related to chat, products, and reviews.
- **middleware/**: Includes middleware for authentication, error handling, input validation, and rate limiting.
- **models/**: Defines the data models for users, products, and reviews using Mongoose schemas.
- **routes/**: Contains route definitions for chat, product, review, and health check endpoints.
- **scripts/**: Includes Python scripts for recommendation algorithms, score calculations, and database seeding.
- **tests/**: Contains test files for validating the functionality of chat, product, and review endpoints.
- **utils/**: Provides utility functions for Azure integrations, logging, and constants used throughout the application.
- **docs/**: Contains API documentation in Swagger format.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB
- Azure account for service integrations

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wally-backend.git
   cd wally-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and add your configuration settings (e.g., database connection string, Azure credentials).

### Running the Application

To start the server, run:
```
node server.js
```

The application will be available at `http://localhost:PORT`, where `PORT` is defined in your `.env` file or defaults to 3000.

### API Documentation

API endpoints and their usage can be found in the `docs/swagger.yaml` file. You can use tools like Swagger UI to visualize and interact with the API.

## Testing

To run the tests, use:
```
npm test
```

This will execute the test cases defined in the `tests/` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.