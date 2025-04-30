// Dangerfile.js — for danger-js

// Flag large pull requests
if (danger.github.pr.additions + danger.github.pr.deletions > 500) {
    warn("⚠️ This PR is big! Consider splitting it.");
  }
  
  // Ensure PR has a title
  if (!danger.github.pr.title || danger.github.pr.title.trim() === "") {
    fail("❌ Please add a PR title.");
  }
  
  // Ensure PR has a meaningful description
  if (!danger.github.pr.body || danger.github.pr.body.trim().length < 10) {
    warn("📝 Consider adding a description to this PR.");
  }
  
  // Encourage test file changes
  const testFileChanged = danger.git.modified_files.some(f => f.includes("test") || f.includes("tests"));
  if (!testFileChanged) {
    warn("🧪 No test files changed.");
  }
  
  // Friendly reminder to assign reviewers
  message("👥 Don't forget to assign reviewers to this PR!");
  