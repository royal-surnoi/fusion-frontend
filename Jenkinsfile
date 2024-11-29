pipeline{
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        docker_registry = 'iamroyalreddy/fusion-fe'
        DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
        DEV_INSTANCE_IP= ''
        SONAR_SCANNER_HOME = tool name: 'sonarqube'
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

        // stage('Dependency Scanning') {
        //     parallel {
        //         stage('NPM Dependency Audit') {
        //             steps {
        //                 sh '''
        //                     npm audit --audit-level=critical
        //                     echo $?
        //                 '''
        //             }
        //         }

        //         stage('OWASP Dependency Check') {
        //             steps {
        //                 dependencyCheck additionalArguments: '''
        //                     --scan \'./\' 
        //                     --out \'./\'  
        //                     --format \'ALL\' 
        //                     --disableYarnAudit \
        //                     --prettyPrint''', odcInstallation: 'OWASP-DepCheck-10'

        //                 dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: false
        //             }
        //         }
        //     }
        // }

        // stage('Unit Testing'){
        //     steps{
        //         sh 'sleep 5s'
        //     }
        // }

        // stage ("SAST - SonarQube") {
        //     steps {
        //         dir('/var/lib/jenkins/workspace/fusion/Fusion-Frontend'){
        //             script {
        //                 withSonarQubeEnv('sonarqube') {
        //                     withEnv(["PATH+SONAR=$SONAR_SCANNER_HOME/bin"]) {
        //                         sh '''
        //                             sonar-scanner \
        //                                 -Dsonar.projectKey=fusion-fe \
        //                                 -Dsonar.sources=. \
        //                                 -Dsonar.host.url=http://3.87.22.97:9000 \
        //                                 -Dsonar.token=sqp_4504048bc6ef51e702899801c87e22b8ccf8a4d2
        //                         '''
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('containerization') {
            steps {
                script{
                    sh '''
                        EXISTING_IMAGE=$(docker images -q $docker_registry)
                        if [ ! -z "$EXISTING_IMAGE" ]; then
                            echo "previous build Image '$IMAGE_NAME' found. Removing..."
                            docker rmi -f $EXISTING_IMAGE
                            echo "previous build image is removed."
                        else
                            echo "No existing image found for '$IMAGE_NAME'."
                        fi
                        docker build -t $docker_registry:$GIT_COMMIT .
                    '''
                }
            }
        }

        // stage('Trivy Vulnerability Scanner') {
        //     steps {
        //         sh  ''' 
        //             trivy image $docker_registry:$GIT_COMMIT \
        //                 --severity LOW,MEDIUM,HIGH \
        //                 --exit-code 0 \
        //                 --quiet \
        //                 --format json -o trivy-image-MEDIUM-results.json

        //             trivy image $docker_registry:$GIT_COMMIT \
        //                 --severity CRITICAL \
        //                 --exit-code 1 \
        //                 --quiet \
        //                 --format json -o trivy-image-CRITICAL-results.json
        //         '''
        //     }
        //     post {
        //         always {
        //             sh '''
        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
        //                     --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json 

        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
        //                     --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json

        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
        //                     --output trivy-image-MEDIUM-results.xml  trivy-image-MEDIUM-results.json 

        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
        //                     --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json          
        //             '''
        //         }
        //     }
        // }

        stage('Publish Docker Image') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker push $docker_registry:$GIT_COMMIT"
            }       
        }
    }
    


post { 
        always { 
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'dependency-check-junit.xml' 
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'trivy-image-CRITICAL-results.xml'
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'trivy-image-MEDIUM-results.xml'            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-CRITICAL-results.html', reportName: 'Trivy Image Critical Vul Report', reportTitles: '', useWrapperFileDirectly: true])
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-MEDIUM-results.html', reportName: 'Trivy Image Medium Vul Report', reportTitles: '', useWrapperFileDirectly: true])
            // echo "\033[34mJob completed. Cleaning up workspace...\033[0m"
            // deleteDir()
        }
        success {
            echo "\033[33mPipeline completed successfully. Performing success actions...\033[0m"
            // Add additional actions here if needed, like sending success notifications
        }
        failure { 
            echo "\033[35mPipeline failed. Triggering failure response...\033[0m"
            // send notification
        }
        unstable {
            echo "\033[34mPipeline marked as unstable. Reviewing issues...\033[0m"
            // Send notification or take action for unstable builds, if needed
        }
        aborted {
            echo "\033[33mPipeline was aborted. Clearing any partial artifacts...\033[0m"
            // Any specific actions for aborted jobs
        }
    }
}

