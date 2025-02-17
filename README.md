# Express.js RestAPI

This project is a REST API template built with Express.js. It serves as a starting point for building RESTful APIs using Node.js and Express.

![Logo](https://socialify.git.ci/Emsa001/rest-api-template/image?font=Inter&language=1&name=1&owner=1&pattern=Solid&stargazers=1&theme=Auto)

## Installation

Clone the repository:

```bash
git clone https://github.com/Emsa001/rest-api-template.git
cd rest-api-template
```

Install dependencies:

```bash
  npm install
```

## Usage

Copy and change the values of .env and .keys.json as needed:

```bash
cp .env.example .env
cp .keys.example.json .keys.json
```

Start the development server:

```bash
npm start
```

## Databases

Sequelize allows you to manage multiple databases effortlessly. You can add as many databases as you need, but ensure that you keep the models for each database separate.

```typescript
// Initialize the first database
const db1 = new Database("db1", { dialect: "sqlite", storage: "./database1.sqlite", logging: false });
// Initialize database with models in directory ./models1
await db1.init("./models1");

// Initialize the second database
const db2 = new Database("db2",{
    dialect: "mysql",
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});
// Initialize database with models in directory ./models2
await db2.init("./models2");
```

## Examples

#### Hello with params

```
  GET /public/hello/:user
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `user`    | `string` | **Required** Username |

#### Hello2 with query values

```
  GET /public/hello2?user=...
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `user`    | `string` | **Required** Username |

#### Authorized Request

```
  GET /auth/hello
```

| HEADER          | Type           | value           |
| :-------------- | :------------- | :-------------- |
| `authorization` | `Bearer Token` | superSecretKey1 |

## Features

-   Structured REST API template
-   Multiple Database Support
-   Bearer authorization with permissions
-   Error Handling with saving to logs
-   Requestss logging

## Authors

-   [@emsa001](https://www.github.com/emsa001)

## License

[MIT](https://choosealicense.com/licenses/mit/)
# gamble_backend
