pipeline {
  agent any

  // Check GitHub for new commits every minute (no public URL needed)
  triggers { pollSCM('* * * * *') }

  options { timeout(time: 20, unit: 'MINUTES') }

  environment {
    IMAGE = 'ci-cd-demo'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    // CI part: every step below runs inside Docker
    stage('Install Dependencies') {
      steps { sh 'docker build --target deps -t $IMAGE:deps .' }
    }

    stage('Test') {
      steps { sh 'docker build --target test -t $IMAGE:test .' }
    }

    stage('Build Docker Image') {
      steps { sh 'docker build --target runtime -t $IMAGE:$BUILD_NUMBER -t $IMAGE:latest .' }
    }

    // CD part: deploy to Vercel (only from main, only if all stages above passed)
    stage('Deploy to Vercel') {
      when { expression { env.GIT_BRANCH == null || env.GIT_BRANCH.endsWith('/main') || env.GIT_BRANCH == 'main' } }
      environment {
        VERCEL_TOKEN      = credentials('vercel-token')
        VERCEL_ORG_ID     = credentials('vercel-org-id')
        VERCEL_PROJECT_ID = credentials('vercel-project-id')
      }
      steps {
        sh 'vercel pull --yes --environment=production --token=$VERCEL_TOKEN'
        sh 'vercel build --prod --token=$VERCEL_TOKEN'
        sh 'vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN'
      }
    }
  }

  post {
    success { echo 'Pipeline succeeded' }
    failure { echo 'Pipeline FAILED - open the red stage and read the log' }
  }
}
