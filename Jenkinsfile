@Library(['git_essalud_lib','common_essalud_lib','docker_essalud_lib','nodejs_essalud_lib']) _

def gitLib = new git_essalud_lib()
def commonLib = new common_essalud_lib()
def dockerLib = new docker_essalud_lib()
def nodejsLib = new nodejs_essalud_lib()

pipeline {

    agent any

    tools {
        'org.jenkinsci.plugins.docker.commons.tools.DockerTool' 'docker-tool'
        nodejs 'nodejs-tool'
    }

    environment {
        GROUP_ID = 'f0ab2856-f06b-4dcb-8cb0-9f3cdbfdd073'
        APPLICATION_ID = '0e548ca9-fcda-407e-9438-258d6e5684ab'

        DOCKERFILE_BUILD_ARG = 'DIST_PATH=dist'
        DOCKER_IMAGE_NAME = 'essalud/apps-qa'
        DOCKER_IMAGE_TAG = 'sigps-web-v1'
        DOCKER_CONTAINER_NAME = 'sigps-web'
    }

    options {
        skipStagesAfterUnstable()
        disableConcurrentBuilds abortPrevious: true
        buildDiscarder(logRotator(numToKeepStr: "${JOB_MAX_DAYS}", daysToKeepStr: "${JOB_MAX_BUILDS}"))
    }

    stages {

        stage('Check Tools') {
            steps {
                script {
                    commonLib.msgJobBuildStarted()
                    nodejsLib.showToolVersion()
                    dockerLib.showToolVersion()
                 }
            }
        }

        stage('Clone Repository') {
            steps {
                checkout scm

                script {
                    gitLib.cloneEnv()
                    commonLib.showWsFiles()
                }
            }
        }

        stage('Build Project') {
            steps {
                script {
                    nodejsLib.npmInstall('--legacy-peer-deps')
                    nodejsLib.buildAngularProject()
                    commonLib.showWsFiles()
                }
            }
        }

        stage('Build Image') {
            steps {
                script { dockerLib.buildImage() }
            }
        }

        stage('Push Image') {
            steps {
                script { dockerLib.pushImage() }
            }
        }

        stage('Deploy') {
            steps {
                script { dockerLib.runContainer() }
            }
        }

    }

    post {
        always { cleanWs() }
        success { script { commonLib.msgJobBuildSuccess() } }
        failure { script { commonLib.msgJobBuildFailed() } }
        unstable { script { commonLib.msgJobBuildUnstable() } }
    }

}
