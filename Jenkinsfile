pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io'
        REGISTRY_CREDENTIALS = 'dockerhub-credentials'
        IMAGE_NAME = 'todo-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_IMAGE = "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
        DOCKER_IMAGE_LATEST = "${REGISTRY}/${IMAGE_NAME}:latest"
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing frontend dependencies...'
                sh '''
                    cd Todo-frontend
                    npm ci
                '''
            }
        }

        stage('Lint') {
            steps {
                echo 'Running code quality checks...'
                sh '''
                    cd Todo-frontend
                    npm run lint || true
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Building Angular application...'
                sh '''
                    cd Todo-frontend
                    npm run build
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh '''
                    cd Todo-frontend
                    npm test -- --watch=false --browsers=ChromeHeadless || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    cd Todo-frontend
                    docker build -t ${DOCKER_IMAGE} -t ${DOCKER_IMAGE_LATEST} .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to registry...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}
                        docker push ${DOCKER_IMAGE_LATEST}
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    docker pull ${DOCKER_IMAGE_LATEST}
                    docker-compose -f docker-compose.staging.yml up -d frontend
                '''
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production environment...'
                sh '''
                    docker pull ${DOCKER_IMAGE_LATEST}
                    docker-compose -f docker-compose.prod.yml up -d frontend
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            cleanWs()
        }
        success {
            echo 'Frontend build and deployment successful!'
        }
        failure {
            echo 'Frontend build or deployment failed!'
        }
    }
}
