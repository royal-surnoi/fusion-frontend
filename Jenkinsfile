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
                            sh '''
                                sonar-scanner \
                                    -Dsonar.projectKey=fusion-fe \
                                    -Dsonar.sources=. \
                                    -Dsonar.host.url=http://3.85.120.238:9000 \
                                    -Dsonar.login=sqp_5439369c85af6daacd648b19b11d726dd3af8a89
                            '''
                        }
                    }
                }
        }
    }
}

