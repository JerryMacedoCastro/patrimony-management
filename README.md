# Gerenciamento de Patrimonio 

### Pré requisitos
- Node JS
- Docker
- NPM ou yarn

### Passo a passo 
- clone o repositório  
`git clone https://github.com/JerryMacedoCastro/patrimony-management.git`

- Navegue até a pasta do projeto e crie um arquivo `.env`. No arquivo criado exponha a porta desejada e o segredo jwt como o exemplo  
`PORT=3000`  
`SECRET=ptjwtsecret123`   

- Instale as dependencias   
`npm install` ou `yarn`

- Rode o o comando de build  
`npm run build` ou `yarn build`

- Inicie o docker  
`docker-compose up --build`

- Altera "PORT" para a porta escolhida no passo anterior. A documentação da API estará disponível em _http://localhost:PORT/api/v1/docs_ 


- Para realizar o upload de arquivos no MinIO é necessário entrar no console com as credenciais 
> Username: _Q3AM3UQ867SPQQA43P2F_
> Password: _zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG_

- Crie um Bucket com o nome _patrimony-management-images_