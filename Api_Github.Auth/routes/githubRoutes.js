import express from "express";
import {
  getOrganizations,
  getOrganizationRepos,
  getCommits,
  getPullRequests,
  getIssues,
  getChangelogs
} from "../controllers/githubData.js";

const router = express.Router();

router.get("/", getOrganizations);
router.get("/:org/repos", getOrganizationRepos);
router.get("/:org/repos/:repo/commits", getCommits);
router.get("/:org/repos/:repo/pulls", getPullRequests);
router.get("/:org/repos/:repo/issues", getIssues);
router.get("/:org/repos/:repo/issues/changelogs", getChangelogs);

export default router;
