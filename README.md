# TpGitlabCI - Arnal Theo - Kopenkin Dmitri - Falcati Rémi

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

## Install Docker Compose & Gitlab-ce

    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose

    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    Tester l'installation : docker-compose --version

4.  Utiliser docker-compose pour installer GitlabCI sur votre VM
    https://docs.gitlab.com/ee/install/docker.html
    A l’aide de la documentation ci-dessus, rédiger un fichier docker-compose.yml plutôt que d’utiliser directement la commande docker fournie.
    Utiliser la version gitlab-ce

        a) Lors de l’installation de Gitlab dans Docker vous allez pouvoir choisir une adresse pour votre gitlab. Vous pouvez utiliser gitlab.example.com

        web:
            image: gitlab/gitlab-ce:latest
            restart: always
            hostname: 'gitlab.devops.com'
            environment:
                GITLAB_OMNIBUS_CONFIG: |
                external_url 'https://gitlab.devops.com'
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

5.  sudo docker exec -it tpgitlabci_web_1 grep 'Password:' /etc/gitlab initial_root_password

    Te2ezMPuBAfgvbMsi42+aHbC1Et42PLC4gyCYPJxtVc=

6.  ssh keygen -t ed25519

7. Création d'un runner gitlab

![](https://cdn.discordapp.com/attachments/921065068869873714/921445106454773830/runner.png)
![](https://cdn.discordapp.com/attachments/921065068869873714/921445088746409994/pipelines.png)

Ajout du token pour que cela fonctionne : ![](https://cdn.discordapp.com/attachments/921065068869873714/921445128692957244/token.png)

## Install & Configure Jenkins

1. Creer le sous-reseau Jenkins

```shell
$ docker network create --driver bridge jenkins
```

2. Afin d'exécuter les commandes Docker dans les nœuds Jenkins, téléchargez et exécutez l'image docker:dind Docker à l'aide de la commande docker run suivante :

```shell
$ docker run \
  --name jenkins-docker \
  --rm \
  --detach \
  --privileged \
  --network jenkins \
  --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 \
  docker:dind \
  --storage-driver overlay2
```

3. Personnalisez l'image officielle de Jenkins Docker en exécutant les deux étapes ci-dessous:

Créez Dockerfile avec le contenu suivant:

```Dockerfile
FROM jenkins/jenkins:2.319.1-jdk11
USER root
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
RUN jenkins-plugin-cli --plugins "blueocean:1.25.2 docker-workflow:1.26"
```

Créez une nouvelle image Docker à partir de ce Dockerfile et attribuez à l'image un nom significatif, par ex. "myjenkins-blueocean:1.1":

```shell
$ docker build -t myjenkins-blueocean:1.1 .
```

4. Exécutez votre propre image myjenkins-blueocean:1.1 en tant que conteneur dans Docker à l'aide de la commande docker run suivante:

```shell
$ docker run \
  --name jenkins-blueocean \
  --rm \
  --detach \
  --network jenkins \
  --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 \
  --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  myjenkins-blueocean:1.1
```

5. Ouvrez la page jenkins à l'adresse http://localhost:8080

6. Entrez dans le conteneur Docker et obtenez le mot de passe initial de celui-ci

```shell
$ docker exec -it jenkins-blueocean cat ~/.jenkins/secrets/initialAdminPassword
```

7. Connectez vous à Jenkins et créez un nouveau compte utilisateur

8. Installez le plugin [NodeJS](https://plugins.jenkins.io/nodejs/) (pour pouvoir tester notre projet exemple)
   <img src="https://i.imgur.com/uNcN5m8.png"> <br/>

9. Configurez le plugin NodeJS pour que Jenkins puisse exécuter le script de test
   <img src="https://i.imgur.com/oS7fwSW.png"> <br/>

10. Créez un nouveau projet dans Jenkins
    <img src="https://i.imgur.com/ossvdxz.png"> <br/>
    <img src="https://i.imgur.com/w7R1W13.png"> <br/>
    <img src="https://i.imgur.com/UntPfEu.png"> <br/>
    Triggers:
    <img src="https://i.imgur.com/TesXTtE.png"> <br/>
    Normalement, nous choisirions la version du webhook, afin de pouvoir lancer des tests automatiques sur chaque option (dans la liste d'options suivante)
    <img src="https://i.imgur.com/MsPyE9l.png">
    mais, parce que nous avons configuré le jenkins localement dans la machine virtuelle,github n'aura pas accès à l'url de rappel, c'est pourquoi nous utilisons soit une tache cron(2), soit lançons les tests manuellement (ce que nous avons décidé de faire)
    <img src="https://i.imgur.com/zkrbxdD.png"> <br/>

11. Lancez le test
    <img src="https://i.imgur.com/yau6jA6.png"><br/>
    <img src="https://i.imgur.com/sO6048A.png"><br/>
    <img src="https://i.imgur.com/vwvTSHG.png"><br/>

## Comparez les résultats

Nous avons constaté que, bien que les deux solutions soient très puissantes, jenkins offre actuellement plus de fonctionnalités grâce à son système de plugins.<br/>
Les deux plates-formes ont leurs points forts et leurs points faibles (ex : déploiement entièrement automatisé d'un serveur gitlab-ci personnalisé et configuré, contrairement à l'installation et à la configuration manuelles avec jenkins).<br/>
Nous pensons que gitlab ci est bon pour les projets de taille petite à moyenne, tandis que quelque chose comme jenkins est exagéré pour les petits projets, mais une très bonne solution pour les projets de taille moyenne à grande.
