versao=$(git rev-parse HEAD | cut -c 1-7)
aws ecr get-login-password --region us-east-1 --profile Gabriel-cloud | docker login --username AWS --password-stdin 534546104156.dkr.ecr.us-east-1.amazonaws.com 
docker build -t bia .
docker tag bia:latest 534546104156.dkr.ecr.us-east-1.amazonaws.com/bia:${versao}
docker push 534546104156.dkr.ecr.us-east-1.amazonaws.com/bia:${versao}
rm .env
./gerar-compose.sh
rm bia-versao.zip
zip -r bia-versao.zip docker-compose.yml

printf "Deploying version ${versao} to AWS Elastic Beanstalk...\n"


