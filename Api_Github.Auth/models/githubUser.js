import mongoose from "mongoose";

const GithubUserSchema = new mongoose.Schema({
  github_id: {
    type: Number,
    unique: true,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not a valid integer for github_id",
    },
  },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  avatar_url: { type: String },
  access_token: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  last_synced_at: { type: Date, default: Date.now },
});

const GithubUser = mongoose.model("GithubUser", GithubUserSchema);
export default GithubUser;
