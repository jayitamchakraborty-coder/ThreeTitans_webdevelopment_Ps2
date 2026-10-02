---
trigger: always_on
---

# LocalLoop — Automatic Git Commit and GitHub Synchronization

## Project Configuration

- Project: LocalLoop
- GitHub repository: `https://github.com/jayitamchakraborty-coder/ThreeTitans_webdevelopment_Ps2.git`
- Primary branch: `main`
- Remote: `origin`

## Core Instruction

Whenever you complete a coding task in this workspace, automatically review, validate, commit, and push the relevant changes to the existing GitHub repository.

Do not require me to manually request a commit or push after every normal coding task.

This rule applies to frontend, backend, UI, API, authentication, database integration, bug fixes, refactoring, and documentation changes that modify project files.

## Mandatory Workflow

After completing each coding task:

1. Inspect the current Git branch using `git branch --show-current`.
2. Inspect the repository status using `git status`.
3. Review changes using `git diff` and `git diff --stat`.
4. Identify files related to the completed task.
5. Check for secrets, credentials, environment files, and unrelated changes.
6. Run the relevant tests, lint checks, or build commands.
7. Confirm that all required checks pass.
8. Stage only the relevant and safe changes.
9. Review the staged changes using `git diff --cached`.
10. Create a meaningful commit message.
11. Commit the changes.
12. Push the commit to the existing GitHub repository.
13. Verify that the push succeeded.
14. Report the result briefly.

Use normal Git commands. Do not use destructive operations.

## Automatic Commit Rules

Create a commit after each completed and validated coding task that produces relevant changes.

Use descriptive commit messages following conventional commit naming where appropriate.

Examples:

- `feat: add community event discovery`
- `feat: implement user registration`
- `fix: resolve authentication issue`
- `ui: improve community dashboard`
- `refactor: organize backend routes`
- `docs: update project README`

Do not create empty commits or commit unrelated changes.

## Security and .gitignore

Never commit:

- `.env`
- `.env.*` containing secrets
- API keys
- Authentication tokens
- Database credentials
- Private keys
- Passwords
- Local secret configuration
- `node_modules/`
- Unnecessary generated build files

Respect the existing `.gitignore` rules.

Before committing, verify that no sensitive files are staged.

Never display or expose the contents of secret files.

If a secret is detected in a tracked or staged file, stop and notify me.

Do not assume that `.gitignore` protects files that Git is already tracking.

## Repository Protection

Never execute:

- `git reset --hard`
- `git push --force`
- `git push -f`
- Commands that discard uncommitted user changes
- Commands that overwrite remote history

Do not change the remote URL or primary branch without explicit instructions.

Do not automatically delete branches.

Preserve all existing project files and user modifications.

## Branch and Synchronization Rules

Use the existing `main` branch and configured `origin` remote for normal synchronization.

Before pushing, check whether the local branch is up to date with its upstream.

If the remote contains new commits or the push is rejected:

- Stop the automatic push workflow.
- Do not force push.
- Do not overwrite remote work.
- Report the issue and request intervention.

If merge conflicts occur, do not automatically resolve potentially destructive conflicts.

## Testing Rules

Run the appropriate tests and build checks before committing.

Use the scripts available in the project's package configuration.

If tests fail:

- Do not automatically commit or push the failed changes.
- Report the failure.
- Include relevant error details.
- Wait for further instructions if the issue cannot be resolved safely.

Never claim that tests passed unless they were actually executed.

If no automated tests are available, perform reasonable checks and report that limitation.

## Error Handling

If Git authentication fails, a command is rejected, a merge conflict occurs, or an unexpected repository state is detected:

- Stop the affected Git operations.
- Preserve all local changes.
- Explain the issue.
- Provide the next safe action.

Do not retry destructive commands or bypass Git safeguards.

## Completion Report

After a successful coding task and GitHub synchronization, provide this summary:

**Changes**
- Brief description of the completed task.
- Main files modified.

**Validation**
- Tests and checks performed.
- Their results.

**GitHub Sync**
- Branch: `main`
- Commit message.
- Commit hash.
- Push result.

If synchronization fails, explain the reason instead of reporting success.

## Scope

This rule is for normal development tasks that modify project files.

Do not commit or push for:

- Questions and explanations.
- Planning discussions.
- Code suggestions that were not applied.
- Tasks explicitly marked as local-only.
- Incomplete implementations.
- Changes that failed required validation.

Do not perform unrelated development work merely to produce a commit.

## Final Objective

Maintain the LocalLoop GitHub repository automatically and safely.

After each successfully completed coding task, validate the changes, create a descriptive Git commit, and push it to the existing GitHub repository without requiring manual Git commands from me.