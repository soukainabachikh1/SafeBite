pipeline{
    agent any

    stages{
        stage("build"){
            steps {
                echo 'building the application'
                nodejs('Node-18.16.0'){
                    sh 'yarn install'
                }                
            }
        }

        stage("test"){
            steps {
                echo 'testing the application'
            }
        }

        stage("deploy"){
            steps {
                echo 'deploying the application'
            }
        }
    }
}
