## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

1. ```bash
   $ npm install
   ```

2. create .env config

```
DB=''
DB_USERNAME=''
DB_PASSWORD=''
DB_HOST=''
COOKIE_KEY=''
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints

### User

- Register
  POST http://localhost:3000/user/register
  Content-Type: application/json

```
{
  username: string,
  password: string,
  email: string
}
```

- Login
  POST http://localhost:3000/user/login
  Content-Type: application/json

```
{
  email: string,
  password: string
}
```

- Update user
  PUT http://localhost:3000/user
  Content-Type: application/json

```
{
  username: string,
  email: string,
  bio: string,
  image: string
}
```

- Get auth data
  GET http://localhost:3000/user

- Logout
  DELETE http://localhost:3000/user

### Article

- Create article
  POST http://localhost:3000/article
  Content-Type: application/json

```
{
  title: string,
  description: string,
  body: string
}
```

- Get all articles with optional query
  GET http://localhost:3000/article

- Get article by slag
  GET http://localhost:3000/article/:slag

- Get all feed article with optional query
  GET http://localhost:3000/article/feed

- Add article to favorite by slag
  POST http://localhost:3000/article/:slag/favorite

- Delete article from favorite by slag
  DELETE http://localhost:3000/article/:slag/unfavorite

- Update article by slag
  PATCH http://localhost:3000/article/:slag
  Content-Type: application/json

```
{
  title: string;

  description: string;

  body: string;

  tagList?: string[];
}
```

- Delete article by slag
  DELETE http://localhost:3000/article/:slag

### Profile

- Get profile by username
  GET http://localhost:3000/profile/:username

- Follow profile
  POST http://localhost:3000/profile/:username/follow

- UnFollow profile
  DELETE http://localhost:3000/profile/username/unfollow

## Stay in touch

- Author - https://github.com/maxdevback

## License

This app is MIT licensed
