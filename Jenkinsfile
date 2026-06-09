pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out code from SCM...'
                checkout scm
            }
        }

        stage('Checkout') {
            steps {
                echo 'Code checkout complete.'
            }
        }

        stage('Debug') {
            steps {
                echo 'Debugging environment info...'
                sh '''
                    node -v || echo 'node not installed on host'
                    npm -v || echo 'npm not installed on host'
                    pwd
                    ls -la || dir
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Building frontend application...'
                sh '''
                    npm ci
                    npm run build
                '''
            }
        }

        stage('Build Docker') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t todo-frontend:latest .'
            }
        }

        stage('Run Container') {
            steps {
                echo 'Starting frontend container...'
                sh '''
                    docker stop todo-frontend-container || true
                    docker rm todo-frontend-container || true
                    docker run -d --name todo-frontend-container \
                      --network todo-network \
                      -p 80:80 \
                      todo-frontend:latest
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Frontend build and deployment successful!'
        }
        failure {
            echo 'Frontend build or deployment failed!'
        }
    }
}
