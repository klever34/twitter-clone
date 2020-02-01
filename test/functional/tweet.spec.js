"use strict";

const { test, trait } = use("Test/Suite")("Tweet");
const Tweet = use("App/Models/Tweet");

trait("Test/ApiClient");

test("Create a tweet", async({ client }) => {
    const tweet = await Tweet.create({
        user_id: 2,
        tweet: "My first tweet"
    });
});