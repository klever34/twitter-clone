"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Tweet = use("App/Models/Tweet");

Route.get("/", () => {
    return { greeting: "Hello world in JSON" };
});
Route.post("/signup", "UserController.signup");
Route.post("/login", "UserController.login");
Route.get("/users", "UserController.allUsers");
Route.group(() => {
        Route.get("/me", "UserController.me");
        Route.put("/update_profile", "UserController.updateProfile");
    })
    .prefix("account")
    .middleware(["auth:jwt"]); // -> /account/me and /account/update_profile
Route.get(":username", "UserController.viewUser");
Route.group(() => {
        Route.get("/users_to_follow", "UserController.usersToFollow");
    })
    .prefix("users")
    .middleware(["auth:jwt"]);
Route.post("/follow/:id", "UserController.follow").middleware(["auth:jwt"]);
Route.delete("/unfollow/:id", "UserController.unFollow");

Route.group(() => {
        Route.post("/create", "FavoriteController.favorite");
    })
    .prefix("favorites")
    .middleware(["auth:jwt"]);
Route.delete("/destroy/:id", "FavoriteController.unFavorite");

Route.post("/tweet", "TweetController.tweet").middleware(["auth:jwt"]);
Route.delete("/tweets/destroy/:id", "TweetController.destroy").middleware([
    "auth:jwt"
]);
Route.get("/tweets/:id", "TweetController.show");
Route.get("/mytimeline", "TweetController.timeline").middleware(["auth:jwt"]);
Route.post("/tweets/reply/:id", "TweetController.reply").middleware([
    "auth:jwt"
]);