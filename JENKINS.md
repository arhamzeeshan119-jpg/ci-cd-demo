# CI/CD with Jenkins + Docker, deploying to Vercel

Pipeline: Checkout -> Install Dependencies -> Test -> Build Docker Image -> Deploy to Vercel
CI (install, test, image build) runs inside Docker. CD deploys the website to Vercel only from main and only if everything before it passed.

## 1. Requirements
Docker Desktop running, a public GitHub repo, and a Vercel project linked once with "vercel link"
(you need orgId and projectId from .vercel/project.json, plus a token from vercel.com/account/tokens).

## 2. Rebuild Jenkins (it now includes Node.js and the Vercel CLI)
    git add .
    git commit -m "Jenkins pipeline deploys to Vercel"
    git push
    cd jenkins
    docker compose up -d --build
    docker exec jenkins vercel --version
    docker exec jenkins docker ps

Your Jenkins data and job are kept (they live in the jenkins_home volume).

## 3. Add the Vercel credentials in Jenkins
Manage Jenkins -> Credentials -> System -> Global credentials (unrestricted) -> Add Credentials.
Create THREE credentials. Kind = Secret text, Scope = Global. The ID must match exactly:

| ID                 | Secret                   |
|--------------------|--------------------------|
| vercel-token       | your Vercel token        |
| vercel-org-id      | orgId from project.json  |
| vercel-project-id  | projectId from project.json |

## 4. Job settings (if not created yet)
New Item -> ci-cd-demo -> Pipeline. Definition = Pipeline script from SCM, SCM = Git,
URL = https://github.com/YOUR-USERNAME/ci-cd-demo.git, Branch = */main, Script Path = Jenkinsfile. Save, Build Now.

All five stages turn green and the last log lines show a Production URL: open it to see the live site.

## 5. Create the errors
Copy a broken file over the original, commit and push to the branch Jenkins watches.

| # | Error type          | Copy this file                                   | ...over this file |
|---|---------------------|--------------------------------------------------|-------------------|
| 1 | Test failure        | errors/1-test-failure/math.js                    | src/math.js       |
| 2 | Build error         | errors/2-build-error/build.js                    | build.js          |
| 3 | Dependency conflict | errors/3-dependency-conflict/package.json        | package.json      |
| 4 | Flaky test          | errors/4-flaky-test/math.test.js                 | test/math.test.js |
| 5 | Infrastructure      | errors/5-infrastructure-jenkins/Jenkinsfile      | Jenkinsfile       |

Another infrastructure error: change the vercel-token credential to a wrong value and run the pipeline.
The stage "Deploy to Vercel" fails with an authentication error. Restore the real token afterwards.

Where each failure turns red:
1. Test failure        -> "Test"                  Expected: 5  Received: -1
2. Build error         -> "Build Docker Image"    SyntaxError: missing ) after argument list
3. Dependency conflict -> "Install Dependencies"  ETARGET No matching version found for left-pad@99.9.9
4. Flaky test          -> "Test" (only some runs; click Build Now several times)
5. Infrastructure      -> "Call External Service" curl: (6) Could not resolve host

When any stage fails, "Deploy to Vercel" is skipped and your live site stays on the last good version.

## 6. Read and save a failure log
Open the build -> Console Output -> last 30 lines. Docker shows the failing step, for example:
    ERROR: process "/bin/sh -c npm test" did not complete successfully: exit code: 1
To save it for your FYP dataset: Console Output -> View as plain text -> save the page as .txt.

## Troubleshooting
- "Could not find credentials entry with ID 'vercel-token'" -> the credential ID is misspelled or missing.
- "vercel: not found" -> run "docker compose up -d --build" again in the jenkins folder.
- "No Project Settings found" / project errors -> check vercel-org-id and vercel-project-id for spaces.
- Authentication / token error -> create a new token and update the vercel-token credential.
- Deploy stage skipped -> you are not on main, or an earlier stage failed (both are expected).
- Docker permission denied -> docker-compose.yml must still contain "user: root".
