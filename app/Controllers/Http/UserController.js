"use strict";
const User = use("App/Models/User");
const Hash = use("Hash");
const Tweet = use("App/Models/Tweet");
const { validate } = use("Validator");

class UserController {
    async allUsers({ request, auth, response }) {
        try {
            const users = await User.all();
            return response.status(200).json({
                status: "All users retrieved",
                data: { users }
            });
        } catch (error) {
            return error;
        }
    }

    async signup({ request, auth, response }) {
        const rules = {
            name: "required",
            email: "required|email",
            password: "required",
            username: "required"
        };

        const validation = await validate(request.all(), rules);

        if (validation.fails()) {
            return response.status(400).json({
                status: "error",
                message: "User cannot be created, please try again."
            });
        }

        const userData = request.only(["name", "username", "email", "password"]);

        try {
            const user = await User.create(userData);
            const token = await auth.generate(user);

            return response.status(201).json({
                status: "User created successfully",
                data: {
                    token,
                    user
                }
            });
        } catch (error) {
            return response.status(400).json({
                status: "error",
                message: "Problem creating user, please try again."
            });
        }
    }

    async login({ request, auth, response }) {
        try {
            const token = await auth.attempt(
                request.input("email"),
                request.input("password")
            );

            const user = await User.query()
                .where("email", request.input("email"))
                .first();

            return response.status(200).json({
                status: "Login successful",
                data: { token, user }
            });
        } catch (error) {
            response.status(400).json({
                status: "error",
                message: "Invalid login credentials"
            });
        }
    }

    async me({ auth, response }) {
        try {
            const user = await User.query()
                .where("id", auth.current.user.id)
                .with("tweets", builder => {
                    builder.with("user");
                    builder.with("favorites");
                    builder.with("replies");
                })
                .with("following")
                .with("followers")
                .with("favorites")
                .with("favorites.tweet", builder => {
                    builder.with("user");
                    builder.with("favorites");
                    builder.with("replies");
                })
                .firstOrFail();

            return response.status(200).json({
                status: "success",
                data: user
            });
        } catch (error) {}
    }

    async updateProfile({ request, auth, response }) {
        try {
            const user = auth.current.user;
            user.name = request.input("name");
            user.username = request.input("username");
            user.email = request.input("email");
            user.location = request.input("location");
            user.bio = request.input("bio");
            user.website_url = request.input("website_url");

            await user.save();

            return response.json({
                status: "success",
                message: "User profile updated successfully",
                data: user
            });
        } catch (error) {
            return response.status(400).json({
                status: "error",
                message: "Problem updating profile, please try again later."
            });
        }
    }

    async changePassword({ request, auth, response }) {
        const user = auth.current.user;
        const verifyPassword = await Hash.verify(
            request.input("password"),
            user.password
        );

        if (!verifyPassword) {
            return response.status(400).json({
                status: "error",
                message: "Current password could not be verified! Please try again."
            });
        }
        user.password = await Hash.make(request.input("newPassword"));
        await user.save();

        return response.json({
            status: "success",
            message: "Password updated!"
        });
    }

    async viewUser({ request, params, response }) {
        try {
            const user = await User.query()
                .where("username", params.username)
                .with("tweets", builder => {
                    builder.with("user");
                    builder.with("favorites");
                    builder.with("replies");
                })
                .with("following")
                .with("followers")
                .with("favorites")
                .with("favorites.tweet", builder => {
                    builder.with("user");
                    builder.with("favorites");
                    builder.with("replies");
                })
                .firstOrFail();

            return response.json({
                status: "success",
                data: user
            });
        } catch (error) {
            return response.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
    }

    async usersToFollow({ params, auth, response }) {
        const user = auth.current.user;
        const usersAlreadyFollowing = await user.following().ids();
        const usersToFollow = await User.query()
            .whereNot("id", user.id)
            .whereNotIn("id", usersAlreadyFollowing)
            .pick(3);

        return response.json({
            status: "success",
            data: usersToFollow
        });
    }

    async follow({ request, auth, response }) {
        const user = auth.current.user;
        await user.following().attach(request.input("user_id"));
        return response.status(200).json({
            status: "successfully followed user"
        });
    }

    async unFollow({ params, auth, response }) {
        const user = auth.current.user;

        await user.following().detach(params.id);

        return response.status(200).json({
            status: "success"
        });
    }

    async timeline({ auth, response }) {
        const user = await User.find(auth.current.user.id);
        const followersIds = await user.following().ids();
        followersIds.push(user.id);

        const tweets = await Tweet.query()
            .whereIn("user_id", followersIds)
            .with("user")
            .with("favorites")
            .with("replies")
            .fetch();

        return response.json({
            status: "success",
            data: tweets
        });
    }

    async show({ params, response }) {
        try {
            const tweet = await Tweet.query()
                .where("id", params.id)
                .with("user")
                .with("replies")
                .with("replies.user")
                .with("favorites")
                .firstOrFail();

            return response.json({
                status: "success",
                data: tweet
            });
        } catch (error) {
            return response.status(404).json({
                status: "error",
                message: "Tweet not found"
            });
        }
    }
}

module.exports = UserController;