# 📝 Resumo das Configurações para AWS Deploy

Este documento resume todas as mudanças feitas no projeto para prepará-lo para deploy na AWS com PostgreSQL.

## ✅ Arquivos Criados

### Backend
1. **`backend/src/main/resources/application-prod.properties`**
   - Configuração PostgreSQL para produção
   - Variáveis de ambiente para AWS RDS
   - Actuator endpoints para health checks
   - Logging otimizado para produção

2. **`backend/Dockerfile`**
   - Multi-stage build (Maven + JRE Alpine)
   - Imagem otimizada (~200MB final)
   - Health check configurado
   - Executa com profile `prod`

3. **`backend/.env.example`**
   - Template de variáveis de ambiente

### Frontend
1. **`frontend/Dockerfile`**
   - Multi-stage build (Node + Nginx)
   - Build otimizado do React
   - Nginx para servir arquivos estáticos

2. **`frontend/nginx.conf`**
   - Configuração Nginx otimizada
   - Gzip habilitado
   - React Router suportado (fallback para index.html)
   - Cache de assets estáticos
   - Health check endpoint

3. **`frontend/.env.example`**
   - Template para variável VITE_API_URL

### Raiz do Projeto
1. **`docker-compose.yml`**
   - PostgreSQL + Backend + Frontend
   - Para testes locais antes do deploy
   - Health checks configurados

2. **`AWS_DEPLOY_GUIDE.md`**
   - Guia completo passo a passo
   - RDS, Elastic Beanstalk, ECS, S3, CloudFront
   - Estimativa de custos
   - Troubleshooting

3. **`DEPLOY_CHECKLIST.md`**
   - Checklist interativo
   - Todos os passos para deploy
   - Seção de troubleshooting

4. **`deploy-aws.sh`**
   - Script automatizado de build
   - Suporta dev (Docker local) e prod (AWS)

5. **`.gitignore` atualizado**
   - Arquivos Docker, AWS, database

6. **`README.md` atualizado**
   - Instruções completas
   - Documentação das tecnologias
   - Links para guias de deploy

## ✅ Arquivos Modificados

### Backend

1. **`backend/pom.xml`**
   - ✅ Adicionado `spring-boot-starter-actuator` (health checks)
   - ✅ PostgreSQL driver já estava presente

2. **`backend/src/main/resources/application.properties`**
   - ✅ Adicionado suporte a profiles (`spring.profiles.active`)
   - ✅ Mantém H2 como padrão para desenvolvimento
   - ✅ Profile pode ser alterado via variável de ambiente

### Frontend
- Nenhuma modificação necessária no código
- Vite proxy continuará funcionando em dev
- Em produção, Nginx serve os arquivos e API usa URL absoluta

---

## 🔄 Como Funciona Agora

### Desenvolvimento Local (H2)
```bash
# Backend
cd backend
./mvnw spring-boot:run
# Usa application.properties (H2)

# Frontend
cd frontend
npm run dev
# Usa proxy do Vite para /api
```

### Teste Local com Docker (PostgreSQL)
```bash
docker-compose up --build
# PostgreSQL + Backend + Frontend
# Testa integração completa
```

### Produção AWS (PostgreSQL)

**Backend:**
```bash
# Define variáveis de ambiente no EB/ECS
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://rds-endpoint:5432/achados_doados
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=senha
CORS_ALLOWED_ORIGINS=https://frontend-url

# Backend usa application-prod.properties
```

**Frontend:**
```bash
# Build com URL da API
VITE_API_URL=https://backend-url npm run build

# Deploy para S3 ou Amplify
aws s3 sync dist/ s3://bucket
```

---

## 🎯 Principais Vantagens

### 1. **Dual Profile System**
- **Dev**: H2 (rápido, sem setup)
- **Prod**: PostgreSQL (robusto, escalável)
- Troca via `SPRING_PROFILES_ACTIVE`

### 2. **Docker Ready**
- Dockerfiles otimizados (multi-stage)
- Imagens pequenas (Alpine)
- Health checks incluídos
- Docker Compose para testes

### 3. **AWS Optimized**
- Variáveis de ambiente configuráveis
- Actuator para health checks (ALB/EB)
- Logging apropriado para CloudWatch
- CORS configurável via env var

### 4. **Zero Breaking Changes**
- Código existente não foi alterado
- Desenvolvimento local continua igual
- Apenas adições de configuração

---

## 📊 Estrutura de Profiles

```
application.properties (DEV)
├── H2 Database (file-based)
├── Debug logging
├── H2 Console habilitado
└── Profile: dev (default)

application-prod.properties (PROD)
├── PostgreSQL via env vars
├── Info logging
├── H2 Console desabilitado
├── Actuator endpoints
└── Profile: prod
```

---

## 🚀 Próximos Passos

1. **Teste Local com Docker**:
   ```bash
   ./deploy-aws.sh dev
   ```

2. **Configure AWS**:
   - Siga `AWS_DEPLOY_GUIDE.md`
   - Use `DEPLOY_CHECKLIST.md` para não perder nada

3. **Deploy Backend**:
   - Elastic Beanstalk (mais fácil) ou
   - ECS/Fargate (mais controle)

4. **Deploy Frontend**:
   - S3 + CloudFront (mais barato) ou
   - Amplify (CI/CD automático)

---

## ❓ FAQ

**Q: Preciso mudar algo no código Java/React?**
A: Não! Tudo funciona com configurações.

**Q: Como testar PostgreSQL localmente sem AWS?**
A: Use `docker-compose up` - roda PostgreSQL local.

**Q: Quanto vai custar?**
A: ~$25-30/mês após free tier (veja AWS_DEPLOY_GUIDE.md).

**Q: E se quiser voltar para H2?**
A: Só não definir `SPRING_PROFILES_ACTIVE` ou setar para `dev`.

**Q: Preciso de dois bancos de dados?**
A: Não. Em dev usa H2 local, em prod usa RDS PostgreSQL.

---

## 📞 Suporte

Para dúvidas sobre deploy:
1. Consulte `AWS_DEPLOY_GUIDE.md`
2. Use `DEPLOY_CHECKLIST.md`
3. Verifique logs no CloudWatch
4. Seção de Troubleshooting nos guias

---

**Projeto pronto para deploy! 🎉**
