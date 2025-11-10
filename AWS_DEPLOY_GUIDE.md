# 🚀 Guia de Deploy na AWS - Achados e Doados

Este guia detalha como fazer o deploy da aplicação Achados e Doados na AWS usando **PostgreSQL instalado na própria instância EC2** (ideal para AWS Academy com restrições).

## 📋 Pré-requisitos

- Conta AWS ativa (AWS Academy)
- Acesso ao console EC2
- Par de chaves SSH (.pem)
- Conhecimento básico de Linux

---

## �️ Parte 1: Criar Instância EC2

### 1. Acessar EC2 Console
https://console.aws.amazon.com/ec2/

### 2. Criar Instância
- **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
- **Instance type**: t2.medium (recomendado) ou t2.small (mínimo)
- **Key pair**: Criar novo ou usar existente
- **Security Group**: Criar com as seguintes regras:
  - **SSH (22)**: Seu IP
  - **HTTP (80)**: 0.0.0.0/0
  - **HTTPS (443)**: 0.0.0.0/0
  - **Custom TCP (8080)**: 0.0.0.0/0 (backend)
  - **Custom TCP (5432)**: 127.0.0.1/32 (PostgreSQL - apenas localhost)

### 3. Conectar via SSH
```bash
chmod 400 sua-chave.pem
ssh -i "sua-chave.pem" ubuntu@SEU_IP_PUBLICO
```

---

## 🗄️ Parte 2: Instalar e Configurar PostgreSQL na EC2

### 1. Atualizar sistema e instalar PostgreSQL
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install postgresql postgresql-contrib -y
```

### 2. Verificar se PostgreSQL está rodando
```bash
sudo systemctl status postgresql
```

### 3. Configurar PostgreSQL
```bash
# Acessar como usuário postgres
sudo -u postgres psql

# Dentro do PostgreSQL, executar:
CREATE DATABASE achados_doados;
CREATE USER achados_user WITH ENCRYPTED PASSWORD 'SuaSenhaSegura123!';
GRANT ALL PRIVILEGES ON DATABASE achados_doados TO achados_user;
\q
```

### 4. Testar conexão local
```bash
psql -h localhost -U achados_user -d achados_doados
# Digite a senha quando solicitado
# Se conectar, está OK!
\q
```

---

## ☕ Parte 3: Instalar Java e Maven

### 1. Instalar Java 11
```bash
sudo apt install openjdk-11-jdk -y
java -version
```

### 2. Instalar Maven
```bash
sudo apt install maven -y
mvn -version
```

---

## 🐳 Parte 4: Deploy do Backend

### 1. Instalar Git e clonar repositório
```bash
sudo apt install git -y
cd ~
git clone https://github.com/chediac/Achados-e-Doados.git
cd Achados-e-Doados/backend
```

### 2. Adicionar dependência do PostgreSQL no pom.xml
```bash
nano pom.xml
```

Adicione dentro da seção `<dependencies>`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 3. Criar arquivo de configuração para produção
```bash
nano src/main/resources/application-prod.properties
```

Adicione:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/achados_doados
spring.datasource.username=achados_user
spring.datasource.password=SuaSenhaSegura123!
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# CORS Configuration
cors.allowed.origins=http://SEU_IP_PUBLICO,http://SEU_IP_PUBLICO:3000

# Server Configuration
server.port=8080

# H2 Console disabled in production
spring.h2.console.enabled=false

# Logging
logging.level.root=INFO
logging.level.com.mackenzie.achadosdoados=INFO
```

### 4. Compilar e gerar JAR
```bash
./mvnw clean package -DskipTests
```

### 5. Testar execução
```bash
java -jar -Dspring.profiles.active=prod target/achados-e-doados-0.0.1-SNAPSHOT.jar
```

Teste em outro terminal:
```bash
curl http://localhost:8080/api/instituicoes
```

### 6. Criar serviço systemd para rodar automaticamente
```bash
sudo nano /etc/systemd/system/achados-doados-backend.service
```

Adicione:
```ini
[Unit]
Description=Achados e Doados Backend
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Achados-e-Doados/backend
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /home/ubuntu/Achados-e-Doados/backend/target/achados-e-doados-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 7. Iniciar e habilitar serviço
```bash
sudo systemctl daemon-reload
sudo systemctl start achados-doados-backend
sudo systemctl enable achados-doados-backend
sudo systemctl status achados-doados-backend
```

### 8. Verificar logs (se necessário)
```bash
sudo journalctl -u achados-doados-backend -f
```

#### 1. Instalar EB CLI:
```bash
pip install awsebcli
```

#### 2. Inicializar EB no backend:
```bash
cd backend
eb init -p docker achados-doados-backend --region us-east-1
```

#### 3. Criar arquivo `.ebextensions/env-vars.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    SPRING_PROFILES_ACTIVE: prod
    DATABASE_URL: jdbc:postgresql://SEU_ENDPOINT_RDS:5432/achados_doados
    DATABASE_USERNAME: postgres
    DATABASE_PASSWORD: SUA_SENHA_RDS
    CORS_ALLOWED_ORIGINS: https://SEU_FRONTEND_URL
```

#### 4. Criar ambiente e fazer deploy:
```bash
eb create achados-doados-backend-env
eb deploy
```

#### 5. Obter URL do backend:
```bash
eb status
# Anote a URL: http://achados-doados-backend-env.xxxxxxxxx.elasticbeanstalk.com
```

### Opção B: AWS ECS (Elastic Container Service)

#### 1. Fazer push da imagem para ECR:
```bash
# Criar repositório ECR
aws ecr create-repository --repository-name achados-doados-backend

# Autenticar Docker com ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build e push
cd backend
docker build -t achados-doados-backend .
docker tag achados-doados-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/achados-doados-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/achados-doados-backend:latest
```

#### 2. Criar Task Definition (via console ou JSON):
```json
{
  "family": "achados-doados-backend",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/achados-doados-backend:latest",
      "memory": 512,
      "cpu": 256,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "SPRING_PROFILES_ACTIVE", "value": "prod"},
        {"name": "DATABASE_URL", "value": "jdbc:postgresql://SEU_RDS_ENDPOINT:5432/achados_doados"},
        {"name": "DATABASE_USERNAME", "value": "postgres"},
        {"name": "DATABASE_PASSWORD", "value": "SUA_SENHA"}
      ]
    }
  ]
}
```

#### 3. Criar serviço ECS com Load Balancer (Application Load Balancer)

---

## 🌐 Parte 5: Deploy do Frontend na mesma EC2

### 1. Instalar Node.js e npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

### 2. Navegar para o diretório do frontend
```bash
cd ~/Achados-e-Doados/frontend
```

### 3. Criar arquivo de configuração de produção
```bash
nano .env.production
```

Adicione (substitua pelo IP público da sua EC2):
```
VITE_API_URL=http://SEU_IP_PUBLICO:8080
```

### 4. Instalar dependências e fazer build
```bash
npm install
npm run build
```

### 5. Instalar e configurar Nginx
```bash
sudo apt install nginx -y
```

### 6. Configurar Nginx para servir o frontend
```bash
sudo nano /etc/nginx/sites-available/achados-doados
```

Adicione:
```nginx
server {
    listen 80;
    server_name SEU_IP_PUBLICO;

    root /home/ubuntu/Achados-e-Doados/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para o backend
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 7. Ativar configuração e reiniciar Nginx
```bash
sudo ln -s /etc/nginx/sites-available/achados-doados /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 8. Testar
Acesse no navegador: `http://SEU_IP_PUBLICO`

---

## 🔐 Parte 6: Configuração de Segurança

### 1. Atualizar CORS no backend

Edite o arquivo de produção:
```bash
nano ~/Achados-e-Doados/backend/src/main/resources/application-prod.properties
```

Atualize:
```properties
cors.allowed.origins=http://SEU_IP_PUBLICO,http://SEU_IP_PUBLICO:80
```

Recompile e reinicie:
```bash
cd ~/Achados-e-Doados/backend
./mvnw clean package -DskipTests
sudo systemctl restart achados-doados-backend
```

### 2. Configurar Firewall (UFW)
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8080/tcp  # Backend (opcional, já está atrás do Nginx)
sudo ufw enable
sudo ufw status
```

### 3. (Opcional) Configurar HTTPS com Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y

# Você precisa de um domínio apontando para o IP da EC2
sudo certbot --nginx -d seu-dominio.com

# Renovação automática já está configurada
```
---

## 📊 Parte 7: Monitoramento e Manutenção

### 1. Verificar status dos serviços
```bash
# Backend
sudo systemctl status achados-doados-backend

# PostgreSQL
sudo systemctl status postgresql

# Nginx
sudo systemctl status nginx
```

### 2. Ver logs
```bash
# Backend
sudo journalctl -u achados-doados-backend -f

# Nginx access
sudo tail -f /var/log/nginx/access.log

# Nginx error
sudo tail -f /var/log/nginx/error.log

# PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 3. Atualizar aplicação
```bash
cd ~/Achados-e-Doados
git pull origin main

# Backend
cd backend
./mvnw clean package -DskipTests
sudo systemctl restart achados-doados-backend

# Frontend
cd ../frontend
npm run build
sudo systemctl restart nginx
```

### 4. Backup do banco de dados
```bash
# Criar backup
pg_dump -U achados_user -h localhost achados_doados > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U achados_user -h localhost achados_doados < backup_20250110.sql
```

---

## 🧪 Parte 8: Checklist de Verificação

- [ ] Instância EC2 criada e acessível via SSH
- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados `achados_doados` criado
- [ ] Java 11 e Maven instalados
- [ ] Repositório clonado
- [ ] Dependência PostgreSQL adicionada no pom.xml
- [ ] Backend compilado com sucesso
- [ ] Serviço systemd do backend criado e ativo
- [ ] Backend respondendo em `http://localhost:8080/api`
- [ ] Node.js instalado
- [ ] Frontend buildado com sucesso
- [ ] Nginx instalado e configurado
- [ ] Frontend acessível via navegador no IP público
- [ ] CORS configurado corretamente
- [ ] Security Group permitindo tráfego HTTP (80)
- [ ] Todos os serviços habilitados para iniciar no boot

---

## 💰 Estimativa de Custos (AWS Academy)

### Configuração Única na EC2:
- **EC2 t2.medium**: Créditos do AWS Academy
- **Storage (20GB)**: Incluído
- **Data Transfer**: Limitado pelo Academy

### Nota Importante:
⚠️ **AWS Academy**: Lembre-se que as instâncias do AWS Academy são temporárias. Sempre faça backup do código e dados antes de encerrar a sessão.

---

## 🚨 Troubleshooting

### Backend não inicia
```bash
# Ver erro específico
sudo journalctl -u achados-doados-backend -n 50

# Verificar se porta 8080 está livre
sudo netstat -tulpn | grep 8080

# Testar conexão com PostgreSQL manualmente
psql -h localhost -U achados_user -d achados_doados
```

### Frontend não carrega
```bash
# Verificar configuração Nginx
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Verificar permissões
ls -la /home/ubuntu/Achados-e-Doados/frontend/dist
```

### Erro de CORS
- Verifique se `cors.allowed.origins` no `application-prod.properties` inclui o IP correto
- Reinicie o backend após alterar configurações
- Limpe o cache do navegador

### PostgreSQL não conecta
```bash
# Verificar se está rodando
sudo systemctl status postgresql

# Ver logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Testar conexão
psql -h localhost -U achados_user -d achados_doados
```

---

## � Comandos Úteis Resumidos

```bash
# Ver status de tudo
sudo systemctl status achados-doados-backend postgresql nginx

# Reiniciar tudo
sudo systemctl restart achados-doados-backend nginx

# Ver IP público
curl http://checkip.amazonaws.com

# Monitorar recursos
htop
df -h
free -h
```

---

## ✅ Próximos Passos (Opcional)

1. **Configurar domínio personalizado** com Route 53
2. **Adicionar HTTPS** com Let's Encrypt
3. **Configurar backups automáticos** com cron jobs
4. **Monitoramento** com CloudWatch
5. **CI/CD** com GitHub Actions
6. **Load Balancer** para alta disponibilidade

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs dos serviços
2. Security Groups da EC2
3. Configurações de CORS
4. Conexão com PostgreSQL

Boa sorte com o deploy! 🚀
- **CloudFront**: 50GB grátis/mês, depois ~$0.085/GB

**Total estimado (após free tier)**: ~$25-30/mês

### Opção Mais Robusta (ECS + ALB):
- **ECS Fargate**: ~$25-40/mês
- **Application Load Balancer**: ~$16/mês
- Demais custos similares

**Total estimado**: ~$60-80/mês

---

## 🚀 Comandos Rápidos

### Deploy rápido do backend (EB):
```bash
cd backend
eb deploy
```

### Deploy rápido do frontend (S3):
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://achados-doados-frontend --delete
aws cloudfront create-invalidation --distribution-id SEU_DISTRIBUTION_ID --paths "/*"
```

---

## 📝 Checklist Final

- [ ] RDS PostgreSQL criado e acessível
- [ ] Backend deployado (EB ou ECS)
- [ ] Frontend deployado (S3+CloudFront ou Amplify)
- [ ] CORS configurado corretamente
- [ ] Security Groups configurados
- [ ] HTTPS habilitado (certificado SSL)
- [ ] Variáveis de ambiente configuradas
- [ ] Testado cadastro, login e funcionalidades principais
- [ ] Logs configurados (CloudWatch)
- [ ] Backup do RDS habilitado

---

## 🆘 Troubleshooting

### Backend não conecta no RDS:
```bash
# Testar conectividade
telnet SEU_RDS_ENDPOINT 5432

# Verificar security group do RDS
# Verificar se o backend está na mesma VPC (se RDS não for público)
```

### Frontend não chama o backend:
- Verificar CORS no backend
- Verificar URL da API no `.env.production`
- Verificar se backend está acessível publicamente

### Erro 502 Bad Gateway:
- Backend não iniciou corretamente
- Verificar logs do CloudWatch
- Verificar health check do Load Balancer

---

## 📚 Recursos Úteis

- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS RDS Docs](https://docs.aws.amazon.com/rds/)
- [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Spring Boot on AWS](https://spring.io/guides/gs/spring-boot-docker/)

---

**Próximos Passos Recomendados:**
1. Configurar domínio customizado (Route 53)
2. Configurar CI/CD (GitHub Actions + AWS)
3. Implementar monitoramento (CloudWatch Dashboards)
4. Configurar backups automáticos do RDS
5. Implementar autoscaling (ECS ou EB)
