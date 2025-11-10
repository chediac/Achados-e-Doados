# Achados e Doados - Projeto Laboratório de Software 06N

<div align="justify">

Nosso projeto consiste na criação de uma plataforma digital de doações que conecta instituições sociais e pessoas dispostas a ajudar. Por meio dessa ferramenta, instituições poderão se cadastrar e registrar suas necessidades específicas como roupas, calçados, alimentos ou materiais escolares enquanto usuários da plataforma poderão visualizar essas demandas e escolher como contribuir.

Esse repositório armazenará todo o trabalho desenvolvido pelo grupo durante o semestre.
<div>

##  Membros do grupo

Eduardo Figueira Losco - 10416659 <br>
Leonardo Magalhães - 10417121 <br>
Lucas Monteiro Soares - 10417881 <br>
Matheus Chediac Rodrigues - 10417490 <br>
Otto Enoc - 10402128 <br>

---

## Tecnologias Utilizadas

### Backend
- Java 11
- Spring Boot 2.7.18
- Spring Security (autenticação)
- Spring Data JPA
- PostgreSQL (produção) / H2 Database (desenvolvimento)
- Maven

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Leaflet (mapas)

---

## Como Executar Localmente

### Pré-requisitos
- Java 11+
- Node.js 18+
- Maven (ou usar o wrapper `./mvnw`)

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`
- Console H2: `http://localhost:8080/h2-console`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

##  Executar com Docker

Para testar a aplicação completa com PostgreSQL:

```bash
docker-compose up --build
```

Acesse:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

---

##  Deploy na AWS

Consulte o guia completo de deploy: [AWS_DEPLOY_GUIDE.md](./AWS_DEPLOY_GUIDE.md)

**Resumo:**
- **Banco de dados**: AWS RDS PostgreSQL
- **Backend**: AWS Elastic Beanstalk ou ECS
- **Frontend**: AWS S3 + CloudFront ou Amplify

---

##  Estrutura do Banco de Dados

- **usuarios** (tabela base com herança JOINED)
  - **doadores** (usuários que fazem doações)
  - **instituicoes** (organizações que recebem doações)
- **demandas** (necessidades publicadas pelas instituições)
- **doacoes** (registro de doações realizadas)

---

##  Segurança

- Senhas criptografadas com BCrypt
- Autenticação baseada em tokens
- CORS configurado para origens permitidas
- Security Groups e IAM na AWS

---

##  Funcionalidades

### Para Doadores
-  Cadastro e login
-  Visualizar instituições no mapa
-  Buscar instituições
-  Ver demandas das instituições
-  Realizar doações

### Para Instituições
-  Cadastro e login
-  Criar e gerenciar demandas
-  Upload de foto de perfil
-  Visualizar doações recebidas
-  Editar informações de perfil

---

##  Profiles do Spring

- **dev** (padrão): Usa H2 Database em arquivo
- **prod**: Usa PostgreSQL com variáveis de ambiente

Para executar em produção:
```bash
SPRING_PROFILES_ACTIVE=prod java -jar backend/target/achados-e-doados-0.0.1-SNAPSHOT.jar
```

---
