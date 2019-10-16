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

4. Create a .env file. Can see at the `sample.env` file

4. Run app to start development server
  `npm run develop`

5. Getting started with register user 
```sh
  open postman. Fill URL with `localhost:3000/api/v1/users` and select `x-www-form-urlencoded` on the `request body` tab and enter the field name `email`, `password`, `fullname`, `role`. 
```
6. For detail information see the documentation 
