# CI/CD Demo - Learn Pipeline Failures

A tiny Node.js project used to learn how a CI/CD pipeline works and how it fails.
GitHub Actions tests and builds the code; on `main` it deploys to Vercel.

## 1. Run locally
    npm install
    npm test
    npm run build

## 2. Push to GitHub
Create an empty PUBLIC repo named `ci-cd-demo` on github.com, then:

    git init
    git add .
    git commit -m "first commit"
    git branch -M main
    git remote add origin https://github.com/YOUR-USERNAME/ci-cd-demo.git
    git push -u origin main

Open the **Actions** tab. The `test` job turns green.
The `deploy` job will FAIL until you finish step 3 (it needs your Vercel secrets). That is normal.

## 3. Connect Vercel (deployment)
    npm install -g vercel
    vercel login
    vercel link

Do NOT connect a Git repository when asked. Then open `.vercel/project.json`
and copy `orgId` and `projectId`. Create a token at https://vercel.com/account/tokens.

In GitHub: Settings > Secrets and variables > Actions > New repository secret. Add:

| Name              | Value                  |
|-------------------|------------------------|
| VERCEL_TOKEN      | your token             |
| VERCEL_ORG_ID     | orgId from project.json |
| VERCEL_PROJECT_ID | projectId from project.json |

Re-run the workflow (Actions > latest run > Re-run all jobs). Both jobs go green and your site is live.

## 4. Create the errors
Each folder in `errors/` holds a ready-made broken file. Always use a new branch:

    git checkout main
    git checkout -b error-test-failure

| # | Error type            | Copy this file                              | ...over this file            |
|---|-----------------------|---------------------------------------------|------------------------------|
| 1 | Test failure          | errors/1-test-failure/math.js               | src/math.js                  |
| 2 | Build error           | errors/2-build-error/build.js               | build.js                     |
| 3 | Dependency conflict   | errors/3-dependency-conflict/package.json   | package.json                 |
| 4 | Flaky test            | errors/4-flaky-test/math.test.js            | test/math.test.js            |
| 5 | Infrastructure        | errors/5-infrastructure/pipeline.yml        | .github/workflows/pipeline.yml |

Then:

    git add .
    git commit -m "introduce error"
    git push -u origin error-test-failure

Open Actions > the red run > the failed job > expand the red step and read the log.
For the flaky test, click "Re-run all jobs" several times: it goes red and green with no code change.

## 5. Fix it
Switch back to main (`git checkout main`) or restore the original file, commit and push. The run turns green.

## Expected log messages
1. Test failure:        Expected: 5  Received: -1
2. Build error:         SyntaxError: missing ) after argument list
3. Dependency conflict: npm error code ETARGET - No matching version found for left-pad@99.9.9
4. Flaky test:          random failures on re-run
5. Infrastructure:      curl: (6) Could not resolve host
