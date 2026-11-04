# Jenkins with the Docker command-line tool installed,
# so pipelines can run "docker build" and "docker run".
FROM jenkins/jenkins:lts-jdk17
USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends docker.io curl \
 && rm -rf /var/lib/apt/lists/*
