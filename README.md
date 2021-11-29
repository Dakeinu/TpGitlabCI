# TpGitlabCI

2. Identifiants

    ip : 163.172.241.101
        utilisateur : root
        password : ynov2021--4

    pour se connecter utiliser : ssh root@ip

3. Installer Docker et Docker Compose sur votre VM.

## Install Docker

    sudo apt-get update

    sudo apt-get install \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update

    sudo apt-get install docker-ce docker-ce-cli containerd.io

## Install Docker Compose

    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose

    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    Tester l'installation : docker-compose --version

4. Utiliser docker-compose pour installer GitlabCI sur votre VM
    https://docs.gitlab.com/ee/install/docker.html
    A l’aide de la documentation ci-dessus, rédiger un fichier docker-compose.yml plutôt que d’utiliser directement la commande docker fournie.
    Utiliser la version gitlab-ce
        
        a) Lors de l’installation de Gitlab dans Docker vous allez pouvoir choisir une adresse pour votre gitlab. Vous pouvez utiliser gitlab.example.com

        web:
            image: gitlab/gitlab-ce:latest
            restart: always
            hostname: 'gitlab.zods.com'
            environment:
                GITLAB_OMNIBUS_CONFIG: |
                external_url 'https://gitlab.zods.com'
            ports:
                - '80:80'
                - '443:443'
                - '22:22'
            volumes:
                - '$GITLAB_HOME/config:/etc/gitlab'
                - '$GITLAB_HOME/logs:/var/log/gitlab'
                - '$GITLAB_HOME/data:/var/opt/gitlab'


        docker-compose up -d


        b) Ensuite modifier votre fichier /etc/hosts local et ajouter la ligne suivante afin que l’adresse gitlab.example.com dirige bien vers votre VM :
            
            nano /etc/hosts

            127.0.0.1 gitlab.zods.com

    6. sudo docker exec -it tpgitlabci_web_1 grep 'Password:' /etc/gitlab  initial_root_password

        Te2ezMPuBAfgvbMsi42+aHbC1Et42PLC4gyCYPJxtVc=

    7. ssh keygen -t ed25519

    
