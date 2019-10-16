```sh
### Requirements
  - You need to install Node js and MongoDB
  - Cloudinary account
  - Sendgrid account

### How to use
1. Clone the project app
  `git clone git@gitlab.com:abduroza/athletehero.git` or `git clone https://gitlab.com/abduroza/athletehero.git`

2. Go to project app directory
  `cd athletehero`

3. Install dependency
  `npm install`

4. Create a .env file
  below the sample .env file:
    SECRET_KEY = 'your_secret_key'
    DB_TYPE = 'LOCAL'
    DB_HOST_LOCAL = 'mongodb://localhost/athletehero'
    DB_HOST_DEVELOP = 'your_mongodb_connecting_string' get from https://cloud.mongodb.com
    SENDGRID_API_KEY = 'your_sendgrid_api_key' get from https://app.sendgrid.com
    CLOUDINARY_API_KEY = 'your_cloudinary_api_key' get from https://cloudinary.com
    CLOUDINARY_API_SECRET = 'your_cloudinary_api_secret'
    CLOUDINARY_CLOUD_NAME = 'your_cloudinary_cloud_name'

4. Run app to start development server
  `npm run develop`

5. Getting started with register user
  open postman fill URL `localhost:3000/api/v1/users` and select `x-www-form-urlencoded` on the `request body` tab and enter the field name `email`, `password`, `fullname`, `role`.

6. For detail information see the documentation 
