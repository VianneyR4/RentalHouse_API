# RentalHouse API Documentation
https://github.com/VianneyR4/RentalHouse_API

## Overview

The RentalHouse API is a RESTful web service that allows users to manage rental properties, bookings, and user roles. It provides functionalities for property creation, updating, deletion, and booking management, along with user authentication via Google OAuth.

## Features

- User authentication using Google OAuth.
- Role-based access control for users (hoster and renter).
- CRUD operations for properties.
- Booking management with date validation.
- JWT-based token generation for secure API access.

## Technologies Used

- Node.js
- Express.js
- Sequelize (ORM for database interaction)
- PostgreSQL (database)
- Passport.js (authentication middleware)
- JSON Web Tokens (JWT) for secure token-based authentication
- Async.js for handling asynchronous operations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- A Google Cloud project with OAuth 2.0 credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/rentalhouse-api.git
   cd rentalhouse-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```plaintext
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=5432
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations to set up the database schema:

   Create your Database in your PhpMyAdmin, then update your credentials by creating the `config/config.json` file then

   ```bash
   {
     "development": {
       "username": "root", (this is the default one for me, you can change it based to your DB)
       "password": "root", (this is the default one for me, you can change it based to your DB)
       "database": "<Name of you database>",
       "host": "<your server host>",
       "port": "<your port>", 
       "dialect": "mysql"
     },
     "test": {
       "username": "root", (this is the default one for me, you can change it based to your DB)
       "password": "root", (this is the default one for me, you can change it based to your DB)
       "database": "<Name of you database>",
       "host": "<your server host>",
       "port": "<your port>", 
       "dialect": "mysql"
     },
     "production": {
       "username": "root", (this is the default one for me, you can change it based to your DB)
       "password": "root", (this is the default one for me, you can change it based to your DB)
       "database": "<Name of you database>",
       "host": "<your server host>",
       "port": "<your port>", 
       "dialect": "mysql"
     }
   }
   ```

5. Run database migrations to set up the database schema:

   ```bash
   npx sequelize-cli db:migrate
   ```

   Note: If not working consider checking if you have migrations files, if not please create them before this commend

6. Start the server:

   ```bash
   npm start
   ```

### API Endpoints

#### Authentication

- **POST** `/auth/google` - Initiates Google OAuth authentication.
- **GET** `/auth/google/callback` - Callback URL for Google OAuth.
- **GET** `/auth/login/success` - Returns user information upon successful login.
- **GET** `/auth/login/failed` - Returns an error message if login fails.

#### Properties

- **POST** `/api/v1/property/create/` - Create a new property (requires hoster role).
- **GET** `/api/v1/properties/all/` - Retrieve all properties.
- **GET** `/api/v1/properties/mine/` - Retrieve properties owned by the authenticated hoster.
- **PUT** `/api/v1/property/update/:propertyId` - Update an existing property.
- **DELETE** `/api/v1/property/delete/:propertyId` - Delete a property.

#### Bookings

- **POST** `/api/v1/booking/create/` - Create a new booking.
- **GET** `/api/v1/booking/mine/` - Retrieve bookings made by the authenticated renter.
- **PUT** `/api/v1/booking/confirm/:bookingId` - Confirm a booking.
- **PUT** `/api/v1/booking/cancel/:bookingId` - Cancel a booking.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


