pipeline{
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        docker_registry = 'iamroyalreddy/fusion-fe'
        DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
        SONAR_SCANNER_HOME = tool name: 'sonarqube'
    }
    options {
        timeout(time: 1, unit: 'HOURS')
        disableResume()
        disableConcurrentBuilds()
        timestamps()
    }
    parameters {
        booleanParam(name: 'CodeAnalysisDependencyCheck', defaultValue: false, description: 'is it required Code Analysis and Dependency Check')
        choice(name: 'DeployToStage', choices: ['yes', 'no'], description: 'is it required Deploy to stage')
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
            when {
                expression{
                    params.CodeAnalysisDependencyCheck == true
                }
            }
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

                stage('Unit Testing'){
                    steps{
                        sh 'sleep 5s'
                    }
                }

                stage ("SAST - SonarQube") {
                    steps {
                        dir('/var/lib/jenkins/workspace/fusion/Fusion-Frontend'){
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
        }

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

        stage('Trivy Vulnerability Scanner') {
            steps {
                sh  ''' 
                    trivy image $docker_registry:$GIT_COMMIT \
                        --severity LOW,MEDIUM,HIGH \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-MEDIUM-results.json

                    trivy image $docker_registry:$GIT_COMMIT \
                        --severity CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o trivy-image-CRITICAL-results.json
                '''
            }
            post {
                always {
                    sh '''
                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json 

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-MEDIUM-results.xml  trivy-image-MEDIUM-results.json 

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json          
                    '''
                }
            }
        }

        stage('Publish Docker Image') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker push $docker_registry:$GIT_COMMIT"
            }       
        }
        stage('Deploy to Development') {
            when {
                expression { 
                    params.DeployToStage == 'yes'
                }
            }
            environment {
                DEV_STAGE_INSTANCE_IP= ''
            }
            stages{
                stage('initialize-Dev-Stage Instance') {
                    steps{
                        dir('/var/lib/jenkins/workspace/fusion/Fusion-Frontend/terrafrom'){
                            sh '''
                                set -e
                                echo "Initializing Terraform..."
                                terraform init
                                echo "Applying Terraform configuration..."
                                terraform apply --auto-approve
                            '''
                        }
                    }
                }
                stage('Deploy - Dev-Stage Instance') {
                    steps {
                        script{
                            // Fetch AWS instance IP
                            withAWS(credentials: 'aws-fusion-dev-deploy', region: 'us-east-1') {
                                DEV_INSTANCE_IP = sh(
                                    script: "aws ec2 describe-instances --query 'Reservations[].Instances[].PublicIpAddress' --filters Name=tag:Name,Values=DevelopmentServer --output text",
                                    returnStdout: true
                                ).trim()
                            }
                            sshagent(['dev-deploy-ec2-instance']) {
                                sh """
                                    ssh -o StrictHostKeyChecking=no ec2-user@${DEV_INSTANCE_IP} "
                                        // echo "Cleaning up old containers..."
                                        // docker ps -aq | xargs -r docker rm -f
                                        echo "Running new Docker container..."
                                        docker run -d -p 80:80 ${docker_registry}:${GIT_COMMIT}
                                    "
                                """
                            }
                        }
                    }   
                }

                stage('Integration Testing in Development') {
                    steps {
                    sh 'sleep 30s'
                    withAWS(credentials: 'aws-fusion-dev-deploy', region: 'us-east-1') {
                            sh  '''
                                sh integration_test.sh
                            '''
                        }
                    }
                }
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
            echo "\033[34mJob completed. Cleaning up workspace...\033[0m"
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

