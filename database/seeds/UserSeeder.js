"use strict";

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

class UserSeeder {
    async run() {
        Factory.blueprint("App/Models/User", async faker => {
            return {
                name: "Bill Alan",
                username: faker.username(),
                password: await Hash.make(faker.password()),
                email: "billalan@gmail.com"
            };
        });
    }
}

module.exports = UserSeeder;