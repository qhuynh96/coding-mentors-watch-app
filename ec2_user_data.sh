#!/bin/bash

# The bash script for installing Docker & starting the container, to be used in EC2 User Data

yum update -y
yum install -y docker
systemctl enable docker.service
systemctl start docker.service
docker pull tuannkhoi/cmwa
docker container run -dit --restart unless-stopped -p 80:3000 tuannkhoi/cmwa