
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'event-management-system'
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $IMAGE_NAME:$IMAGE_TAG .
                    docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker run --rm $IMAGE_NAME:$IMAGE_TAG npm test
                '''
            }
        }

        stage('Deploy to Minikube') {
            when {
                expression {
                    fileExists('k8s/deployment.yaml')
                }
            }
            steps {
                sh '''
                    sed "s|IMAGE_PLACEHOLDER|$IMAGE_NAME:$IMAGE_TAG|g" k8s/deployment.yaml \
                      | kubectl apply -f -

                    kubectl apply -f k8s/service.yaml

                    kubectl rollout status deployment/event-app --timeout=180s

                    kubectl get pods -o wide
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline finished successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
