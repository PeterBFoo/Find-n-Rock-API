import { DataBaseSeeder } from "./migrations/DatabaseSeeder";

let seeder = new DataBaseSeeder();
(async () => {
    try {
        await seeder.up();
        console.log("\x1b[42m", "DATABASE SEEDED 🍀", "\x1b[0m")
    } catch (e) {
        console.log("Something went wrong:", e)
    }
})()
