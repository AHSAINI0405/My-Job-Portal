const cron = require("node-cron");
const Job = require("../src/models/Job");

cron.schedule("0 0 * * *", async () => {
  await Job.updateMany(
    { dueDate: { $lt: new Date() } },
    { status: "expired" }
  );
});
