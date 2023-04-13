import { DataBaseSeeder } from "./migrations/DatabaseSeeder";

let seeder = new DataBaseSeeder();

(async () => {
    try {
        await seeder.down();
        console.log("\x1b[42m", "DROPPED DATABASE 💿", "\x1b[0m")
    } catch (e) {
        console.log("Something went wrong:", e)
    }
})()
