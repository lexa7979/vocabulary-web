#!/bin/bash

# export NEEDRESTART_MODE=a
# sudo apt update
# sudo apt upgrade -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install lts/gallium

git clone https://github.com/lexa7979/vocabulary-web
cd vocabulary-web
npm install

# https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem -batch
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem

export GLOSFOERHOER_SESSION_KEY="8cRVqjCt2M9@vpkJmW#zyB2E5/h67#Tde4c9N@7w"
nohup node serverDev.js &
