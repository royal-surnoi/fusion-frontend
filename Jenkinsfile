pipeline{
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        // docker_registry = 'iamroyalreddy/fusion-fe'
        // DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
        SONAR_SCANNER_HOME = tool name: 'sonarqube'
    }
    stages{
        stage('Build and Package'){
            steps{
                dir('/var/lib/jenkins/workspace/fusionIQ/Fusion-Frontend'){
                    sh '''
                        npm install 
                        ng build --configuration=production
                    '''
                }
            }
        }

        stage ("SAST - SonarQube") {
                steps {
                    dir('/var/lib/jenkins/workspace/fusionIQ/Fusion-Frontend'){
                        script {
                            withSonarQubeEnv('sonarqube') {
                                withCredentials([string(credentialsId: 'sonar-fe-credentials', variable: 'SONAR_TOKEN')]){
                                    withEnv(["PATH+SONAR=$SONAR_SCANNER_HOME/bin"]) {
                                        sh '''
                                                sonar-scanner \
                                                    -Dsonar.projectKey=fusion-fe \
                                                    -Dsonar.sources=. \
                                                    -Dsonar.host.url=$SONAR_HOST_URL \
                                                    -Dsonar.token=$SONAR_TOKEN
                                            '''    
                                }
                            }
                        }
                    }
                }
            }
    }
}

