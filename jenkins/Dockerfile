# Jenkins + Docker command-line + Node.js + Vercel CLI
FROM jenkins/jenkins:lts-jdk17
USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
 && (apt-get install -y --no-install-recommends docker-cli \
     || apt-get install -y --no-install-recommends docker.io) \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && npm install -g vercel@latest \
 && rm -rf /var/lib/apt/lists/* \
 && docker --version && node --version && vercel --version