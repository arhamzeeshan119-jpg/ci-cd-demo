# Each stage below is run separately by the Jenkins pipeline,
# so a failure shows up in the exact stage that caused it.

# Stage 1: install dependencies  (fails on dependency conflicts)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: run the tests  (fails on test failures / flaky tests)
FROM deps AS test
COPY . .
RUN npm test

# Stage 3: build the website  (fails on build / compilation errors)
FROM deps AS build
COPY . .
RUN npm run build

# Stage 4: the final small image that serves the website
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
