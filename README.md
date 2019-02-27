# graphql-express-mongo-jwt-docker-boilerplate

This is a pure API backend boilerplate which include the following functionality

### Authentaction with JWT:
  * Graphql
  * Signup (email, password)
  * Email Verification
  * Login (email, password)
  * Forgot password
  * Password reset
  * Facebook token signup / signin

### Technology Stack:
  * [Docker](https://www.docker.com/)
  * [Docker Compose](https://docs.docker.com/compose/)
  * [Node.js](https://nodejs.org)
  * [Express](https://expressjs.com/)
  * [MongoDB](https://www.mongodb.com/)
  * [Mongo Express](https://github.com/mongo-express/mongo-express)
  * [graphql-yoga](https://github.com/prisma/graphql-yoga)
  * [SendGrid](https://sendgrid.com/) for email service

### Getting start:

1. Rename `.env.example` to `.env` and 
2. Fill in your setting and credentials in `.env`
3. `docker-compose up`

* localhost:3000 for api signup login stuff (you can try it in postman)
* localhost:4000 for graphql play ground
* localhsot:8082 for mongo express (inspecting database)

### Enjoy!


