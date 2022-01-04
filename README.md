# Example News API

## Background

The creation of an `API` to mimic a real world backend service which will provide the information to front end architecture. The `API` uses `PSQL Database` and `node-postgres`.
<hr>

## Live Hosted Version of API
Hosted version of API: <https://example-news-api.herokuapp.com/api>
<hr>

## Pre setup

Before you start you will need to have `PSQL Database` installed on your computer.

<hr>

## Setup Example News API

Update to the latest version of node.js and postgres if you have problems running the API.

### 1. Clone example-news-api

HTTPS
```
https://github.com/milcroft/example-news-api.git
```

SSH
```
git@github.com:milcroft/example-news-api.git
```

GitHub CLI
```
gh repo clone milcroft/example-news-api
```

###  2. install npm packages

```
npm i
```

### 3. Create environment variables and put them in the root directory.

```
File-Name: .env.development
File-Data: PGDATABASE=nc_news

```

```
File-Name: .env.test
File-Data: PGDATABASE=nc_news_test
```

### 4. Setup database

```
npm run setup-dbs
```

###  5. Seed Database

```
npm run seed
```

###  6. Start listening on port 9090

```
npm run dev
```

###  7. Accessing the API in your browser

```
http://localhost:9090/api/
```

### 8. Viewing endpoints

This `endpoint` will show you a `json` representation of all the available `endpoints` of the `API`

```
/api
```

Here is a list of the `API endpoints` available for `GET` Requests

```
GET/api/topics
GET/api/articles
GET/api/articles/:article_id
GET/api/articles/:article_id/comments
GET/api/users
GET/api/users/:username
```

For the `articles endpoint` you can use `order` and `sort_by` query.

Examples: of `GET` requests using order and sort_by.

```
GET/api/articles?order=asc
GET/api/articles?order=desc
GET/api/articles?sort_by=title
GET/api/articles?order=asc&sort_by=title
GET/api/articles?sort_by=comment_count&order=asc

```

Example of `PATCH` request for articles.

```
PATCH /api/articles/:article_id

inc_vote +1 or -1

```

Example of `POST` request for posting new comments.

```
POST /api/articles/:article_id/comments

- username
- body

```

Example of `DELETE` request for deleting a comment.

```
DELETE /api/comments/:comment_id

- delete comment by comment_id

```

## Tests

A test suite is included in the repository. The default test behavior runs the tests suite from the folder `tests`.

1. The tests are run with Jest.
2. To run tests use the following utility with npm:

```
npm run test
```

## Minimum Versions Required

Node.js: `v17.2.0`

Postgres `v14.1`