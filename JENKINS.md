# CI/CD with Jenkins + Docker (Windows)

Pipeline: Checkout -> Install Dependencies -> Test -> Build Image -> Deploy (Docker container on http://localhost:8081)

Files added for this: Dockerfile, .dockerignore, Jenkinsfile, jenkins/Dockerfile, jenkins/docker-compose.yml

## 1. Install Docker Desktop
Download from docker.com, install with the WSL 2 option, restart the PC, open Docker Desktop and wait until it says "Engine running".

    docker --version
    docker run hello-world

## 2. Push the updated project to GitHub (repository must be PUBLIC)
    git add .
    git commit -m "add Docker and Jenkins files"
    git push

## 3. Start Jenkins
    cd jenkins
    docker compose up -d --build

The first start takes several minutes. Check that Jenkins can use Docker:

    docker exec jenkins docker ps

## 4. Unlock Jenkins
Open http://localhost:8080. Get the password:

    docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

Paste it, choose "Install suggested plugins", create your admin user, then Save and Finish.

## 5. Create the pipeline job
1. New Item -> name: ci-cd-demo -> Pipeline -> OK
2. Pipeline section: Definition = "Pipeline script from SCM"
3. SCM = Git. Repository URL = https://github.com/YOUR-USERNAME/ci-cd-demo.git
4. Branch Specifier = */main
5. Script Path = Jenkinsfile
6. Save, then click "Build Now"

After the first run, Jenkins checks GitHub every minute and runs automatically on every new commit.
Open http://localhost:8081 to see the deployed website.

## 6. Create the errors
Copy a broken file over the original, commit and push to the branch Jenkins is watching.
(To practise on a separate branch: create the branch, then in the job click Configure and set Branch Specifier = */your-branch.)

| # | Error type          | Copy this file                                   | ...over this file |
|---|---------------------|--------------------------------------------------|-------------------|
| 1 | Test failure        | errors/1-test-failure/math.js                    | src/math.js       |
| 2 | Build error         | errors/2-build-error/build.js                    | build.js          |
| 3 | Dependency conflict | errors/3-dependency-conflict/package.json        | package.json      |
| 4 | Flaky test          | errors/4-flaky-test/math.test.js                 | test/math.test.js |
| 5 | Infrastructure      | errors/5-infrastructure-jenkins/Jenkinsfile      | Jenkinsfile       |

Where each failure turns red:
1. Test failure        -> stage "Test"                (Expected: 5  Received: -1)
2. Build error         -> stage "Test" passes, then the image build fails: SyntaxError: missing ) after argument list
3. Dependency conflict -> stage "Install Dependencies" (ETARGET No matching version found for left-pad@99.9.9)
4. Flaky test          -> stage "Test", only some runs. Click "Build Now" several times.
5. Infrastructure      -> stage "Call External Service" (curl: (6) Could not resolve host)

Important: the Deploy stage never runs when an earlier stage fails, so the website on http://localhost:8081 stays on the last good version.

## 7. Read a failure log
Open the build (#5, #6 ...) -> "Console Output". Scroll to the last 30 lines. Docker shows the failing step like:
    ERROR: process "/bin/sh -c npm test" did not complete successfully: exit code: 1
To save the log for your FYP dataset: Console Output -> "View as plain text" -> save the page as a .txt file.

## 8. Fix and go green
Restore the original file, commit and push. Jenkins runs again and turns green.

## Troubleshooting
- docker: command not found inside Jenkins -> run "docker compose up -d --build" again in the jenkins folder.
- permission denied on docker.sock -> make sure docker-compose.yml still has "user: root".
- Port 8080 or 8081 already in use -> change the left number in the port mapping (for example "9090:8080").
- Git checkout fails in Jenkins -> the GitHub repository must be public and the URL must end with .git.
- Docker Desktop will not start -> enable virtualisation in BIOS and install WSL 2 (run: wsl --install).
- Stop everything: "docker compose down" in the jenkins folder, and "docker rm -f ci-cd-demo-app".
