pipeline{
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        docker_registry = 'iamroyalreddy/fusion-be'
        DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
        DEV_INSTANCE_IP= ''
    }
    options {
        // timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    stages{
        stage('Build and Package'){
            steps{
                sh 'npm install --no-audit'
            }
        }
        stage('NPM Dependency Audit') {
            steps {
                sh '''
                    npm audit --audit-level=critical
                    echo $?
                '''
            }
        }
    }
    



}

