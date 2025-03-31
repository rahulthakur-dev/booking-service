# Node.js Project Template

This is a base Node.js project template, which anyone can use as it has been prepared by keeping some of the most important code principles and project management recommendations. Feel free to change anything.

## Project Structure

The `src` folder contains all the actual source code related to the project. It does not include any tests. (You might want to create a separate `tests` folder.)

### `src` Folder Structure

- **`config/`** → This folder contains all configurations and setups of libraries or modules.

  - Example: Setting up `dotenv` so that we can use environment variables cleanly in `server-config.js`.
  - Another example: Setting up a logging library for meaningful logs, with configurations placed here.

- **`routes/`** → This folder registers routes and maps them to their respective middleware and controllers.

- **`middlewares/`** → This folder contains middleware functions that intercept incoming requests. These may include validators, authenticators, etc.

- **`controllers/`** → Controllers act as the last middleware before calling the business logic layer.

  - They receive incoming requests and data, then pass them to the business layer.
  - Once the business layer returns an output, controllers format the API response and send the result.

- **`repositories/`** → This folder contains all the logic to interact with the database, including raw queries or ORM-based queries.

- **`services/`** → This folder houses the business logic and interacts with repositories to fetch and process data.

- **`utils/`** → Contains helper methods, error classes, and utility functions.

## Setup the Project

1. Download this template from GitHub and open it in your favorite text editor.

2. Navigate to the project folder and install dependencies:
    
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    
    ```sh
    PORT=<your-port-number>
    ```
    
    Example:
    
    ```sh
    PORT=3000
    ```

4. Initialize Sequelize inside the `src` folder:
    
    ```sh
    npx sequelize init
    ```
    
    This will generate `migrations/`, `seeders/`, and `config.json` inside `src/config`.

5. Configure your database:
    
    - In `config.json`, add your database username and password under `development`.
    - Specify the `dialect` (e.g., MySQL, MariaDB, PostgreSQL, etc.).
    - For test or production environments, replace `host` with the hosted database URL.

6. Start the server:
    
    ```sh
    npm run dev
    ```