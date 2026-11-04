pipeline {
  agent any

  // Check GitHub for new commits every minute (no public URL needed)
  triggers { pollSCM('* * * * *') }

  options { timeout(time: 15, unit: 'MINUTES') }

  environment {
    IMAGE = 'ci-cd-demo'
    CONTAINER = 'ci-cd-demo-app'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install Dependencies') {
      steps { sh 'docker build --target deps -t $IMAGE:deps .' }
    }

    stage('Test') {
      steps { sh 'docker build --target test -t $IMAGE:test .' }
    }

    stage('Build Image') {
      steps { sh 'docker build --target runtime -t $IMAGE:$BUILD_NUMBER -t $IMAGE:latest .' }
    }

    stage('Deploy') {
      // Deploy only from the main branch
      when { expression { env.GIT_BRANCH == null || env.GIT_BRANCH.endsWith('/main') || env.GIT_BRANCH == 'main' } }
      steps {
        sh 'docker rm -f $CONTAINER || true'
        sh 'docker run -d --name $CONTAINER -p 8081:80 $IMAGE:latest'
        echo 'Deployed! Open http://localhost:8081'
      }
    }
  }

  post {
    success { echo 'Pipeline succeeded' }
    failure { echo 'Pipeline FAILED - open the red stage and read the log' }
  }
}
