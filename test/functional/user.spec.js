"use strict";

const { test, trait } = use("Test/Suite")("User");
const User = use("App/Models/User");

trait("Test/ApiClient");
trait("Auth/Client");

test("Create User", async({ assert, client }) => {
    const user = await User.create({
        name: "Mike Jordan",
        email: "mike_j@yahoo.com",
        username: "mikolo",
        password: "password"
    });

    const response = await client
        .get("/users")
        .loginVia(user, "jwt")
        .end();
    response.assertStatus(200);
});