pipeline {
    agent any
 
    environment {
        DOCKERHUB_USER = 'spydev32'
        IMAGE_NAME     = "${DOCKERHUB_USER}/event-management-system"
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }
 
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
 
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG -t $IMAGE_NAME:latest .'
            }
        }
 
        stage('Run Tests') {
            steps {
                sh 'docker run --rm $IMAGE_NAME:$IMAGE_TAG npm test'
            }
        }
 
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                    sh '''
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }
 
        stage('Deploy to Minikube') {
            when {
                expression { fileExists('k8s/deployment.yaml') }
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
        always {
            sh 'docker logout || true'
        }
        success {
            echo 'Pipeline finished successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
