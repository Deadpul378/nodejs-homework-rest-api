const app = require("./app");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const { DB_HOST, DB_PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(DB_PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
