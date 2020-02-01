"use strict";
const Tweet = use("App/Models/Tweet");
const Reply = use("App/Models/Reply");

class TweetController {
    async tweet({ request, auth, response }) {
        const user = auth.current.user;

        const tweet = await Tweet.create({
            user_id: user.id,
            tweet: request.input("tweet")
        });

        await tweet.loadMany(["user", "favorites", "replies"]);

        return response.json({
            status: "success",
            message: "Tweet posted!",
            data: tweet
        });
    }

    async timeline({ request, response }) {
        console.log("called");
        console.log("called");
        console.log("called");
        try {
            const tweet = await Tweet.all()
                .with("replies")
                .with("favorites")
                // .with("user")
                .fetch();

            return response.json({
                status: "success",
                message: "All Tweets",
                data: tweet
            });
        } catch (error) {
            console.log(error);
        }
    }

    async reply({ request, auth, params, response }) {
        const user = auth.current.user;

        const tweet = await Tweet.find(params.id);

        const reply = await Reply.create({
            user_id: user.id,
            tweet_id: tweet.id,
            reply: request.input("reply")
        });

        await reply.load("user");

        return response.json({
            status: "success",
            message: "Reply posted!",
            data: reply
        });
    }

    async show({ request, params, response }) {
        const tweet = await Tweet.query()
            .where("id", params.id)
            .with("replies")
            .with("favorites")
            .firstOrFail();

        return response.json({
            status: "success",
            message: "Tweet found!",
            data: tweet
        });
    }

    async destroy({ request, auth, params, response }) {
        const user = auth.current.user;

        const tweet = await Tweet.query()
            .where("user_id", user.id)
            .where("id", params.id)
            .firstOrFail();

        await tweet.delete();

        return response.json({
            status: "success",
            message: "Tweet deleted!",
            data: null
        });
    }
}

module.exports = TweetController;