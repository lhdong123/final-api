# Classroom API

## Getting Started

### Prerequisites

- Git
- Node.js
- MongoDB
- Create credentials to access your enabled APIs

### Installing

1. Clone the repo

```
$ git clone https://github.com/PTUDWNC-Classroom/midterm-classroom-api.git
```

2. Install NPM packages

```
$ npm install
```

3. Databse

4. Add `.env` file

```
URI=[your local MongoDB]
INVITATION_LINK='your url' + 'join-'   // ex: http://localhost:3001/join-
JWT_SECRET='your JWT secret'
GOOGLE_CLIENT_ID='your Google client ID
GOOGLE_CLIENT_SECRET='your Google client secret'
```

### Run

```
$ npm start
// or
$ npm run dev (using nodemon)
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Authors

- 18120318 - Lý Hán Đồng
- 18120321 - Huỳnh Thanh Đức
