# ✅ Checklist de Deploy - Achados e Doados

Use este checklist para garantir que tudo está configurado corretamente antes do deploy na AWS.

## 📋 Pré-Deploy

### Configuração Local
- [ ] H2 funcionando corretamente no desenvolvimento
- [ ] Todas as funcionalidades testadas localmente
- [ ] Testes unitários passando (se houver)
- [ ] Frontend compilando sem erros (`npm run build`)
- [ ] Backend compilando sem erros (`./mvnw clean package`)
- [ ] Docker Compose testado localmente (`docker-compose up`)

### Conta AWS
- [ ] Conta AWS criada e ativa
- [ ] AWS CLI instalado (`aws --version`)
- [ ] AWS CLI configurado (`aws configure`)
- [ ] Cartão de crédito válido cadastrado (para cobranças após free tier)

---

## 🗄️ Banco de Dados (RDS PostgreSQL)

- [ ] RDS PostgreSQL criado
- [ ] Endpoint do RDS anotado: `___________________________`
- [ ] Username: `postgres`
- [ ] Password segura criada e armazenada
- [ ] Security Group configurado para aceitar conexões na porta 5432
- [ ] Backup automático habilitado (recomendado)
- [ ] Testada conexão local com psql ou DBeaver

**Comando de teste:**
```bash
psql -h SEU_ENDPOINT_RDS -U postgres -d achados_doados
```

---

## 🔧 Backend (Spring Boot)

### Opção A: Elastic Beanstalk
- [ ] EB CLI instalado (`pip install awsebcli`)
- [ ] Aplicação inicializada (`eb init`)
- [ ] Arquivo `.ebextensions/env-vars.config` criado
- [ ] Variáveis de ambiente configuradas:
  - [ ] `SPRING_PROFILES_ACTIVE=prod`
  - [ ] `DATABASE_URL=jdbc:postgresql://SEU_RDS:5432/achados_doados`
  - [ ] `DATABASE_USERNAME=postgres`
  - [ ] `DATABASE_PASSWORD=SUA_SENHA`
  - [ ] `CORS_ALLOWED_ORIGINS=https://SEU_FRONTEND_URL`
- [ ] Deploy realizado (`eb deploy`)
- [ ] URL do backend anotada: `___________________________`
- [ ] Testado endpoint health: `/actuator/health`

### Opção B: ECS (Fargate)
- [ ] ECR repository criado
- [ ] Imagem Docker buildada
- [ ] Imagem enviada para ECR
- [ ] Task Definition criada com variáveis de ambiente
- [ ] Service criado
- [ ] Application Load Balancer configurado
- [ ] Target Group com health check em `/actuator/health`
- [ ] Security Groups configurados
- [ ] URL do backend anotada: `___________________________`

---

## 🌐 Frontend (React)

### Opção A: S3 + CloudFront
- [ ] Bucket S3 criado: `achados-doados-frontend`
- [ ] Static website hosting habilitado
- [ ] Política pública configurada
- [ ] Arquivo `.env.production` criado com `VITE_API_URL`
- [ ] Build realizado (`npm run build`)
- [ ] Arquivos enviados para S3 (`aws s3 sync dist/ s3://bucket`)
- [ ] CloudFront distribution criada
- [ ] Error pages configuradas (404 → `/index.html`)
- [ ] HTTPS habilitado
- [ ] URL do frontend anotada: `___________________________`

### Opção B: AWS Amplify
- [ ] Repositório conectado
- [ ] Build settings configurados
- [ ] Variável `VITE_API_URL` configurada
- [ ] Deploy automático ativado
- [ ] Branch selecionada
- [ ] URL do frontend anotada: `___________________________`

---

## 🔐 Segurança

### CORS
- [ ] Backend configurado com URL do frontend:
  ```
  CORS_ALLOWED_ORIGINS=https://d1234567890.cloudfront.net
  ```
- [ ] Testado CORS no browser (console sem erros)

### HTTPS
- [ ] Certificado SSL configurado (ACM)
- [ ] CloudFront usando HTTPS
- [ ] Backend com HTTPS (via ALB ou EB)

### Security Groups
- [ ] RDS: Aceita conexões apenas do Security Group do backend
- [ ] Backend: Aceita HTTP/HTTPS de qualquer lugar
- [ ] Backend: Pode conectar no RDS (porta 5432)

### IAM
- [ ] Policies mínimas configuradas (não usar Admin)
- [ ] Service roles criadas (EB, ECS, etc)

---

## 🧪 Testes Pós-Deploy

### Backend
- [ ] Health check respondendo: `https://BACKEND_URL/actuator/health`
- [ ] Endpoint de teste: `https://BACKEND_URL/api/debug/info`
- [ ] Logs no CloudWatch sem erros críticos

### Frontend
- [ ] Página inicial carrega
- [ ] Assets (CSS, JS, imagens) carregando
- [ ] React Router funcionando (rotas navegáveis)

### Integração
- [ ] Cadastro de doador funciona
- [ ] Login de doador funciona
- [ ] Cadastro de instituição funciona
- [ ] Login de instituição funciona
- [ ] Criação de demanda funciona
- [ ] Upload de foto funciona
- [ ] Busca de instituições funciona
- [ ] Mapa de instituições funciona
- [ ] Doações sendo registradas

### Console do Browser
- [ ] Sem erros de CORS
- [ ] Sem erros 404 para APIs
- [ ] Sem erros 500

---

## 📊 Monitoramento

- [ ] CloudWatch Logs configurado
- [ ] Alarmes criados (CPU, memória, erros)
- [ ] Dashboard criado (opcional)
- [ ] Notificações SNS configuradas (opcional)

---

## 💰 Custos

- [ ] Budget configurado na AWS
- [ ] Alertas de custo ativados
- [ ] Free tier monitorado

**Estimativa mensal após free tier:** ~$25-30/mês

---

## 📝 Documentação

- [ ] URLs de produção documentadas:
  - Frontend: `___________________________`
  - Backend: `___________________________`
  - RDS Endpoint: `___________________________`
- [ ] Credenciais armazenadas com segurança (não no código!)
- [ ] Processo de deploy documentado
- [ ] Processo de rollback definido

---

## 🚨 Troubleshooting Comum

### "Cannot connect to database"
- Verificar Security Group do RDS
- Verificar credenciais (DATABASE_URL, USERNAME, PASSWORD)
- Verificar se backend está na mesma VPC (se RDS privado)

### "CORS policy error"
- Verificar CORS_ALLOWED_ORIGINS no backend
- Verificar URL exata do frontend (com/sem https, trailing slash)

### "502 Bad Gateway"
- Backend não iniciou corretamente
- Verificar logs do CloudWatch
- Verificar health check do Load Balancer

### Frontend mostra página em branco
- Verificar console do browser
- Verificar se VITE_API_URL está correto
- Verificar se nginx.conf está correto

---

## ✅ Deploy Concluído!

Após completar todos os itens acima, seu sistema estará em produção na AWS! 🎉

**Próximos passos recomendados:**
1. Configurar domínio customizado (Route 53)
2. Implementar CI/CD (GitHub Actions)
3. Configurar backups automáticos
4. Implementar monitoramento avançado
5. Otimizar custos (Reserved Instances, etc)
