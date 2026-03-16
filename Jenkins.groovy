// Jenkins Pipeline for PetStore API Tests
// This pipeline runs Playwright tests with Page Object Model and generates Allure Reports

pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'prod'],
            description: 'Environment to run tests against'
        )
        booleanParam(
            name: 'GENERATE_ALLURE_REPORT',
            defaultValue: true,
            description: 'Generate Allure Report'
        )
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '30'))
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }
    
    environment {
        NODE_ENV = "${params.ENVIRONMENT}"
        CI = '1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out code from repository..."
                    checkout scm
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing Node.js dependencies..."
                    sh 'npm install'
                    echo "Installing Playwright browsers..."
                    sh 'npx playwright install'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    echo "Running Playwright tests against ${NODE_ENV} environment..."
                    try {
                        sh 'npm test'
                    } catch (Exception e) {
                        echo "Tests failed: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Generate Allure Report') {
            when {
                expression { params.GENERATE_ALLURE_REPORT == true }
            }
            steps {
                script {
                    echo "Generating Allure Report..."
                    sh 'allure generate allure-results --clean -o allure-report'
                    echo "Allure Report generated successfully"
                }
            }
        }
        
        stage('Publish Reports') {
            steps {
                script {
                    echo "Publishing test results..."
                    
                    // Publish HTML Report
                    publishHTML([
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright HTML Report',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    
                    // Publish JUnit Report
                    junit testResults: 'test-results/junit.xml', keepLongStdio: true
                    
                    // Publish Allure Report
                    script {
                        try {
                            allure([
                                includeProperties: false,
                                jdk: '',
                                reportBuildPolicy: 'ALWAYS',
                                results: [[path: 'allure-results']]
                            ])
                        } catch (Exception e) {
                            echo "Allure plugin not configured, skipping: ${e.message}"
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "Cleaning up..."
                // Archive test results
                archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true
                
                // Publish test metrics
                script {
                    try {
                        def testResults = readJSON file: 'test-results/results.json'
                        def totalTests = testResults.stats.expected
                        def passedTests = testResults.stats.expected - testResults.stats.failed - testResults.stats.skipped
                        def failedTests = testResults.stats.failed
                        def skippedTests = testResults.stats.skipped
                        
                        echo """
                        ========================================
                        TEST EXECUTION SUMMARY
                        ========================================
                        Total Tests: ${totalTests}
                        Passed: ${passedTests}
                        Failed: ${failedTests}
                        Skipped: ${skippedTests}
                        Pass Rate: ${(passedTests/totalTests*100).toInteger()}%
                        ========================================
                        """
                    } catch (Exception e) {
                        echo "Could not parse test results: ${e.message}"
                    }
                }
            }
        }
        
        success {
            script {
                echo "All tests passed successfully!"
                // Send notification for success
            }
        }
        
        unstable {
            script {
                echo "Some tests failed. Check reports for details."
                // Send notification for unstable
            }
        }
        
        failure {
            script {
                echo "Pipeline failed!"
                // Send notification for failure
            }
        }
        
        cleanup {
            script {
                cleanWs()
            }
        }
    }
}
