import express from "express";
import Jobs from "../Models/Job.js";

const JobRouter = express.Router();

JobRouter.get("/", (req, res) => {
  res.send("<p>Job Post fetched</p>");
});

JobRouter.post("/add", async (req, res) => {
  console.log(req.body);
  try {
    const newJob = await Jobs(req.body);
    await newJob.save();
    return res.send({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobRouter.get("/get-all", async (req, res) => {
  try {
    const jobs = await Jobs.find();
    return res.send({
      status: true,
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "ERR_DB_CONN",
    });
  }
});

JobRouter.post("/get-applied-jobs", async (req, res) => {
  console.log("arrived here to fetch applied jobs");
  console.log(req.body);
  try {
    const response = await Jobs.find({
      _id: { $in: req.body.jobIds },
    });
    console.log(response.length);
    return res.send({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
    });
  }
});

JobRouter.post("/get-posted-jobs/:user_id", async (req, res) => {
  console.log(req.params.user_id);
  try {
    const response = await Jobs.find({ CreatorInfo: req.params.user_id });
    console.log(response.length);
    return res.send({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobRouter.delete("/delete-job-post/:job_id", async (req, res) => {
  console.log(`Id to be deleted ${req.params.job_id}`);
  try {
    const response = await Jobs.deleteOne({ _id: req.params.job_id });
    console.log(response);
    if (response.deletedCount === 1)
      return res.send({
        status: true,
      });

    return res.send({
      status: false,
      message: "Cannot be deleted",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});
export default JobRouter;
