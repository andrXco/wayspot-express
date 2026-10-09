import app from "./app.js";
import { sequelize } from "./database/database.js";
import { setupRelations } from "./models/relations.js";
import { loadInitialUsers } from "./database/initUsers.js";
import { loadInitialPlaces } from "./database/initPlaces.js";

async function main() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        setupRelations();

        await sequelize.sync();
        console.log("Database synchronized successfully.");

        await loadInitialUsers();
        await loadInitialPlaces();

        app.listen(3000, "0.0.0.0");
        console.log("Server listening on port 3000");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

main();
