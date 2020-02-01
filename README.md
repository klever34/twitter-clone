# Adonis API application


## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick --api-only
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run

The Models are =>
User
Token
Tweet
Reply
Favorite(likes)
Followers
```

### Some Endpoints

Basically, the app implemented this and others =>
- User signup
- User sign in (using JWT)
- Post tweet
- Reply to tweet
- Follow other users
- View own timeline
- Search (Tweets and Users)

Create User -> /signup
Login -> /login
Get Auth'd user -> /account/me
View User -> /:username
Create Tweet => /tweet
Follow User -> /follow/:id
Users to follow -> /users/users_to_follow
and so on ...

### What the App does
1. Can create and authenticate a user.
2. Can post a tweet.
3. Like a tweet and also reply a tweet
4. View tweet with all related tables (users, replies, favorites)
5. Search a tweet and user.
6. User can view people to follow and can follow other users.
7. Few tests were written.
and so on...

### Programming laguage: NodeJS
### Framework: AdonisJS
### DB: Postgres

Github link-> https://github.com/klever34/twitter-clone
Hosted on Heroku at -> https://softcom-twitter-clone-app.herokuapp.com/
Postman Docs -> https://documenter.getpostman.com/view/3633582/SWTBdxKb?version=latest

