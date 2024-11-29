pipeline{
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        docker_registry = 'iamroyalreddy/fusion-fe'
        DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
        DEV_INSTANCE_IP= ''
    }
    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    stages{
        stage('Build and Package'){
            steps{
                dir('/var/lib/jenkins/workspace/fusion/Fusion-Frontend'){
                    sh '''
                        npm install --no-audit
                        ng build --configuration=production
                    '''
                }
            }
        }
        stage('Dependency Scanning') {
            parallel {
                stage('NPM Dependency Audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }

                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan \'./\' 
                            --out \'./\'  
                            --format \'ALL\' 
                            --disableYarnAudit \
                            --prettyPrint''', odcInstallation: 'OWASP-DepCheck-10'

                        dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: false
                    }
                }
            }
        }

        stage('Unit Testing'){
            steps{
                sh 'sleep 5s'
            }
        }
        stage ("SAST - SonarQube") {
            steps {
                dir('/var/lib/jenkins/workspace/fusion/Fusion-Frontend'){
                    script {
                        withSonarQubeEnv(installationName: 'sonarqube', credentialsId: 'sonar-credentials') {
                            sh '''
                                sonar-scanner \
                                    -Dsonar.projectKey=fusion-fe \
                                    -Dsonar.sources=. \
                                    -Dsonar.host.url=http://3.87.22.97:9000 \
                                    -Dsonar.token=sqp_4504048bc6ef51e702899801c87e22b8ccf8a4d2
                            '''
                        }
                    }
                }
            }
        }

        // stage('containerization') {
        //     steps {
        //         script{
        //             sh '''
        //                 EXISTING_IMAGE=$(docker images -q $docker_registry)
        //                 if [ ! -z "$EXISTING_IMAGE" ]; then
        //                     echo "previous build Image '$IMAGE_NAME' found. Removing..."
        //                     docker rmi -f $EXISTING_IMAGE
        //                     echo "previous build image is removed."
        //                 else
        //                     echo "No existing image found for '$IMAGE_NAME'."
        //                 fi
        //                 docker build -t $docker_registry:$GIT_COMMIT .
        //             '''
        //         }
        //     }
        // }

    }
    



}

