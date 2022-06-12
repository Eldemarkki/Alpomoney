# Expenseer

This is a personal finance tracker developed with React, Next.js and Prisma.

The project is under heavy development, and is not ready for production. It still has a lot of vulnerabilities which I'm aware of (such as IDORs in almost every endpoint), because I haven't had time to fix them yet.

## Running

Start a Postgres database, for example with `docker-compose up`.

Create a .env file with `DATABASE_URL` and `SESSION_PASSWORD` fields, you can take a look at `.env.example` to see examples.

Install node modules with `npm install`

Run the project in development mode with `npm run dev`