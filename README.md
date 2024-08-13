Here’s an updated README file template reflecting the use of Jest for testing:

```markdown
# TV Scraper

## Overview

TV Scraper is a Node.js application that fetches TV show and cast information from the TVMaze API and stores it in MongoDB. The application provides an API to retrieve the TV shows with their cast details, sorted by birthday.

## Features

- Scrapes TV show and cast data from TVMaze API.
- Stores the data in a MongoDB database.
- Provides a REST API for accessing TV show and cast information.
- Includes unit tests using Jest.
- Configured with a CI pipeline for automated testing.

## Installation

### Prerequisites

- Node.js 21 or higher
- MongoDB (local installation or cloud instance)

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/tv-scraper.git
   cd tv-scraper
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/tvshows
   MONGODB_URI_TEST=mongodb://localhost:27017/tvshows_test
   ```

4. **Start the Application**

   ```bash
   npm start
   ```

## Testing

1. **Run Tests**

   To run the unit tests, ensure MongoDB is running and execute:

   ```bash
   npm test
   ```

2. **Run Tests with Coverage**

   To run tests with coverage reports, use:

   ```bash
   npm run test:coverage
   ```

## API Endpoints

### Get TV Shows with Cast

- **Endpoint:** `/api/shows`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (optional): Page number for pagination.
  - `limit` (optional): Number of results per page.
- **Response:**

  ```json
  [
    {
      "id": 1,
      "name": "Game of Thrones",
      "cast": [
        {
          "id": 7,
          "name": "Mike Vogel",
          "birthday": "1979-07-17"
        },
        {
          "id": 9,
          "name": "Dean Norris",
          "birthday": "1963-04-08"
        }
      ]
    },
    {
      "id": 4,
      "name": "Big Bang Theory",
      "cast": [
        {
          "id": 6,
          "name": "Michael Emerson",
          "birthday": "1950-01-01"
        }
      ]
    }
  ]
  ```

## Deployment

To deploy the application, you can use a cloud provider like AWS, Heroku, or DigitalOcean. Follow their respective documentation for deploying Node.js applications.

## CI/CD

The project is configured with a CI pipeline to automatically run tests on code changes. You can set this up using GitHub Actions, GitLab CI, or another CI/CD tool.

## Contributing

1. **Fork the Repository**
2. **Create a New Branch**
3. **Make Your Changes**
4. **Submit a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [TVMaze API](https://www.tvmaze.com/api) for providing the TV show data.
- [MongoDB](https://www.mongodb.com/) for database storage.
- [Express.js](https://expressjs.com/) for the web framework.
- [Jest](https://jestjs.io/) for testing.

```

### Jest Configuration

If you need to include Jest configuration details in your README, you can add a section like this:

```markdown
## Jest Configuration

The project uses Jest for testing. Here are some useful commands:

- **Run All Tests**: `npm test`
- **Run Tests with Coverage**: `npm run test:coverage`

Make sure your `package.json` includes the following scripts:

```json
"scripts": {
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```
```

Feel free to modify any part of this template to better suit your project's needs!