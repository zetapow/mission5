/* Import Mongo client from MongoDB and Command from cimmander */
const { Command } = require("commander");
// import seed functions from seedUtils
const { seedDatabase, clearDatabase } = require("./util/seedUtils");

// command instance for CLI commands
const program = new Command();

// seed command for CLI
program
   .command("seed")
   .description("Seed the database with station data")
   .action(seedDatabase);

// clear command for CLI
program
   .command("clear")
   .description("Clear the database of all station data")
   .action(clearDatabase);

// Parse command line arguments
program.parse(process.argv);

// usage example:
// To seed the database, run: node seed.js seed
// To clear the database, run: node seed.js clear
