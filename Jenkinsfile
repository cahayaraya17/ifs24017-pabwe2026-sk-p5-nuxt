pipeline {
    agent any

    environment {
        BUN_INSTALL = "$HOME/.bun"
        PATH = "$BUN_INSTALL/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'curl -fsSL https://bun.sh/install | bash || true'
                sh 'bun install'
            }
        }

        stage('Test & Coverage') {
            steps {
                sh 'bun run test:coverage'
            }
        }

        stage('Build') {
            steps {
                sh 'bun run build'
            }
        }
    }
}