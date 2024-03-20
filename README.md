# Authentication Implementation

# overview

* Created Server using express on PORT 5000.

* Connected with mongoDb using mongoose

* implemented Logics
    * Login
    * SignUp
    * Update Password
    * Get all users
    * Get user by Id
    * Send token with httpOnly cookies

* Implement deep error handling 
    * programming error vs operational errors
    * developement vs production error handling
    * handled Uncaught promises

* Used Best practices for Scalability

* Used Environment variables.


## Available Scripts

In the project directory, you can run:

### `npm install` 

To install all dependencies

### `npm start` 

Runs the app in the development mode.

### `npm run start:prod`

Runs the app in the production mode.


## API's  ( USED POSTMAN TO TEST ALL API'S)

### POST signp
http://localhost:5000/api/signup

### POST login
http://localhost:5000/api/login

### GET get-all-users
http://localhost:5000/api/users

### PATCH update Password
http://localhost:5000/api/updatePassword


### GET get-user-by-id
http://localhost:5000/api/users/{id}