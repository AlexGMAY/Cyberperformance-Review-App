const cronRegistry = new Map(); // Map to store cron jobs by name

const registerCronJob = (name, cronJob) => {
  if (cronRegistry.has(name)) {
    throw new Error(`Cron job with name '${name}' already exists.`);
  }
  cronRegistry.set(name, cronJob);
};

const getCronJob = (name) => cronRegistry.get(name);

const stopCronJob = (name) => {
  const cronJob = cronRegistry.get(name);
  if (cronJob) {
    cronJob.stop();
    return true;
  }
  return false;
};

const startCronJob = (name) => {
  const cronJob = cronRegistry.get(name);
  if (cronJob) {
    cronJob.start();
    return true;
  }
  return false;
};

const listCronJobs = () =>
  Array.from(cronRegistry.entries()).map(([name, job]) => ({
    name,
    running: job.running,
  }));

module.exports = {
  registerCronJob,
  getCronJob,
  stopCronJob,
  startCronJob,
  listCronJobs,
};
