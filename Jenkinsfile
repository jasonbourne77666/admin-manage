pipeline {
    agent any

    // environment {
        // 定义环境变量，例如 Docker 镜像名称
        // IMAGE_NAME = 'jasonbourne77666_server'
        // BUILD_NUMBER = '0.0.1'
    // }

    stages {
        stage('Build') {
            steps {
            nodejs('node18.19') {
                    sh "node --version"
                    // 安装依赖
                    // pnpm 在 jenkins nodejs插件中安装
                    sh "pnpm install"
                    // 运行构建
                    sh "pnpm run build"
                    // 压缩dist-new文件夹
                    sh "tar -zcvf dist.tar.gz dist"
                }
            }
        }

        // stage('Test') {
        //     steps {
        //         script {
        //             // 运行测试（确保 Dockerfile 中有相应的 CMD 或 ENTRYPOINT）
        //             sh "docker run --rm ${IMAGE_NAME}:${BUILD_NUMBER} npm test"
        //         }
        //     }
        // }

        stage('Deploy') {
            steps {
                script {
                    // 流水线语法 Exec command
                    // cd /project/admin
                    // rm -rf dist
                    // tar -xzvf dist.tar.gz
                    // cd dist
                    // sleep 5
                    // exit
                    // 流水线语法ssh选项 Exec in pty，Source files：dist.tar.gz， Remote directory /admin
                    sshPublisher(publishers: [sshPublisherDesc(configName: 'aliyun_server', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''cd /project/admin
                    rm -rf dist
                    tar -xzvf dist.tar.gz
                    sleep 5
                    exit''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/admin', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'dist.tar.gz', usePty: true)], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
                    
                    echo 'Credentials SUCCESS'
                }
            }
        }
    }

    // post {
    //     always {
    //         // sh "node --version"
    //         // 清理工作，例如删除构建时创建的 Docker 镜像和容器
    //         // sh "docker container prune -f"
    //         // sh "docker image prune -f"
    //     }
    //     // success {
    //         // 成功构建后的操作，例如发送通知
    //     // }
    //     // failure {
    //         // 构建失败的操作，例如发送通知
    //     // }
    // }
}
