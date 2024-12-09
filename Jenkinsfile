pipeline{
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        docker_registry = 'iamroyalreddy/fusion-fe'
        DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
    }
    stages{
        stage('Build and Package'){
            steps{
                dir('/var/lib/jenkins/workspace/fusion/Fusion-Frontend'){
                    sh '''
                        npm install 
                        ng build --configuration=production
                    '''
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

        stage('Publish Docker Image') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker push $docker_registry:$GIT_COMMIT"
            }       
        }

        // stage('Deploy to Development') {
        //     environment {
        //         DEV_STAGE_INSTANCE_IP= ''
        //     }
        //     stages{
        //         stage('initialize-Dev-Stage Instance') {
        //             steps{
        //                 dir('/var/lib/jenkins/workspace/fusion/Fusion-Frontend/terrafrom'){
        //                     sh '''
        //                         set -e
        //                         echo "Initializing Terraform..."
        //                         terraform init
        //                         echo "Applying Terraform configuration..."
        //                         terraform destroy --auto-approve
        //                         sleep 40s
        //                     '''
        //                 }
        //             }
        //         }
        //         stage('Deploy - Dev-Stage Instance') {
        //             steps {
        //                 script{
        //                     // Fetch AWS instance IP
        //                     withAWS(credentials: 'aws-fusion-dev-deploy', region: 'us-east-1') {
        //                         DEV_INSTANCE_IP = sh(
        //                             script: "aws ec2 describe-instances --query 'Reservations[].Instances[].PublicIpAddress' --filters Name=tag:Name,Values=DevelopmentServer --output text",
        //                             returnStdout: true
        //                         ).trim()
        //                     }
        //                     sshagent(['dev-deploy-ec2-instance']) {
        //                         sh """
        //                             ssh -o StrictHostKeyChecking=no ec2-user@${DEV_INSTANCE_IP} "
        //                                 // echo "Cleaning up old containers..."
        //                                 // docker ps -aq | xargs -r docker rm -f
        //                                 echo "Running new Docker container..."
        //                                 docker run -d -p 80:80 ${docker_registry}:${GIT_COMMIT}
        //                             "
        //                         """
        //                     }
        //                 }
        //             }   
        //         }

        //         stage('Integration Testing in Development') {
        //             steps {
        //             sh 'sleep 30s'
        //             withAWS(credentials: 'aws-fusion-dev-deploy', region: 'us-east-1') {
        //                     sh  '''
        //                         sh integration_test.sh
        //                     '''
        //                 }
        //             }
        //         }
        //     }
        // }



    }
    post { 
        always { 
            deleteDir()
        }
    }
}

