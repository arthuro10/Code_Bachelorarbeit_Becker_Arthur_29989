
# Installation

1. Open terminal, change to this project directory and run `npm i`
2. Go to `server/config` and set your database under `develop`
3. Create a database on your MySQL Server and name it: website_develop
4. Run `npm run database:migrate`
5. Run `npm run database:seeds`
6. This will create tables and a demo user with username "Demo" and password "123456789"

# Develop on local machine (to test ssr)

1. Run `npm run start:dev`
2. Open browser on [http://localhost:3000/](http://localhost:3000/)
3. Open [http://localhost:3000/admin-login](http://localhost:3000/admin-login)
4. Log in with credentials "Demo" and "123456789"

# Develop with hot reload

1. Run `npm run start:frontend:hotreload`
2. Run `npm run start:server:hotreload`
2. Open browser on [http://localhost:8080/](http://localhost:8080/)
3. Open [http://localhost:8080/admin-login](http://localhost:8080/admin-login)
4. Log in with credentials "Demo" and "123456789"

Important: Server is running on localhost:3000 and frontend on localhost:8080

# Test

1. Run `npm test`

# Production 

1. Run `npm run build:prod`
2. Files should appear in a folder named `dist`