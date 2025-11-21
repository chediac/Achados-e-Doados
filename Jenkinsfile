pipeline {
    agent any

    tools {
        maven 'Maven3'
        jdk 'JDK11'
    }

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh './mvnw clean verify'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }
    }

    post {
        success {
            echo 'Build e testes concluídos com sucesso.'
        }
        failure {
            echo 'Falha detectada. Verifique os logs acima.'
        }
    }
}
