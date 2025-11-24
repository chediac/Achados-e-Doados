# Achados e Doados - Plataforma de Doações

<div align="center">
  <img src="https://img.shields.io/badge/Java-11-orange?style=for-the-badge&logo=java" />
  <img src="https://img.shields.io/badge/Spring_Boot-2.7.18-green?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/H2_Database-2.1-blue?style=for-the-badge&logo=database" />
  <img src="https://img.shields.io/badge/Tests-Passing-brightgreen?style=for-the-badge" />
</div>

<br/>

<div align="justify">

**Achados e Doados** é uma plataforma digital desenvolvida para conectar instituições sociais com pessoas dispostas a ajudar. A aplicação facilita o processo de doações ao permitir que organizações cadastrem suas necessidades específicas e doadores possam visualizar e atender essas demandas de forma simples e transparente.

### Objetivo do Projeto

Criar uma ponte digital entre quem precisa e quem pode ajudar, tornando o processo de doação mais eficiente, transparente e acessível. A plataforma permite que instituições divulguem suas necessidades em tempo real e que doadores encontrem causas alinhadas com seus valores.

### Diferenciais

- **Visualização em Mapa**: Encontre instituições próximas a você
- **Gestão de Demandas**: Instituições podem criar e acompanhar suas necessidades
- **Segurança**: Autenticação robusta e dados criptografados
- **Interface Moderna**: Design responsivo e intuitivo
- **Atualizações em Tempo Real**: Demandas sempre atualizadas

<div>

---

## Índice

- [Sobre o Projeto](#achados-e-doados---plataforma-de-doações)
- [Membros do Grupo](#membros-do-grupo)
- [Tecnologias](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura-do-sistema)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#manual-de-instalação)
- [Como Usar](#manual-de-utilização)
- [API Endpoints](#documentação-da-api)
- [Banco de Dados](#banco-de-dados)
- [Testes](#testes-automatizados)
- [Segurança](#segurança)

---

| Nome | RA |
|------|-----|
| Eduardo Figueira Losco | 10416659 |
| Leonardo Magalhães | 10417121 |
| Lucas Monteiro Soares | 10417881 |
| Matheus Chediac Rodrigues | 10417490 |
| Otto Enoc | 10402128 |

**Disciplina**: Laboratório de Software 06N  
**Semestre**: 2025.2

---

## Tecnologias Utilizadas

### Backend
- Java 11
- Spring Boot 2.7.18
- Spring Security (autenticação)
- Spring Data JPA
- H2 Database (banco de dados em arquivo)
- Maven

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Leaflet (mapas)

### DevOps & Ferramentas
- GitHub Actions (CI/CD)
- Maven
- Git

---

## Arquitetura do Sistema

A aplicação segue uma arquitetura de **três camadas** com separação clara entre frontend e backend:

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React)                    │
│  - Interface do Usuário                         │
│  - Gerenciamento de Estado                      │
│  - Rotas e Navegação                            │
└────────────────┬────────────────────────────────┘
                 │ HTTP/REST
                 │
┌────────────────▼────────────────────────────────┐
│           BACKEND (Spring Boot)                  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │     Controllers (API REST)               │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐  │
│  │     Services (Lógica de Negócio)        │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐  │
│  │     Repositories (Acesso a Dados)       │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                                │
└─────────────────┼────────────────────────────────┘
                  │ JPA/Hibernate
                  │
┌─────────────────▼────────────────────────────────┐
│        BANCO DE DADOS (H2 Database)              │
│  - Usuários (Doadores/Instituições)             │
│  - Demandas                                      │
│  - Doações                                       │
└──────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Cliente** envia requisição HTTP para o backend
2. **Controller** recebe e valida a requisição
3. **Service** executa a lógica de negócio
4. **Repository** acessa o banco de dados via JPA
5. **Resposta** é enviada de volta ao cliente em formato JSON

---

## Estrutura do Projeto

```
Achados-e-Doados/
├── .github/
│   └── workflows/
│       └── tests.yml              # CI/CD com GitHub Actions
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mackenzie/achadosdoados/
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── model/         # Entidades JPA
│   │   │   │   ├── repository/    # Interfaces JPA
│   │   │   │   ├── service/       # Lógica de negócio
│   │   │   │   ├── config/        # Configurações (Security, CORS)
│   │   │   │   └── AchadosEDoadosApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-prod.properties
│   │   └── test/
│   │       └── java/               # Testes unitários
│   ├── pom.xml                     # Dependências Maven
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── pages/                  # Páginas da aplicação
│   │   ├── lib/                    # Utilitários (auth, etc)
│   │   ├── assets/                 # Imagens e recursos
│   │   ├── App.jsx                 # Componente principal
│   │   └── main.jsx                # Ponto de entrada
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md

```

---

## Manual de Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Java JDK 11** ou superior ([Download](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html))
- **Node.js 18+** e npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Instalação Local

#### 1. Clone o Repositório

```bash
git clone https://github.com/chediac/Achados-e-Doados.git
cd Achados-e-Doados
```

#### 2. Configure o Backend

```bash
cd backend

# Compile o projeto (baixa dependências)
./mvnw clean install

# Execute a aplicação
./mvnw spring-boot:run
```

O backend estará rodando em: **http://localhost:8080**

**Console H2 Database**: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/achadosdoados`
- Username: `sa`
- Password: *(deixe em branco)*

#### 3. Configure o Frontend

Abra um novo terminal:

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

---

## Manual de Utilização

### Para Doadores

#### 1. Criar uma Conta

1. Acesse a página inicial
2. Clique em **"Cadastrar"** no menu superior
3. Selecione **"Sou Doador"**
4. Preencha os dados:
   - Nome completo
   - Email
   - Senha (mínimo 6 caracteres)
5. Clique em **"Cadastrar"**

#### 2. Fazer Login

1. Clique em **"Entrar"** no menu
2. Digite seu email e senha
3. Clique em **"Entrar"**

#### 3. Visualizar Instituições no Mapa

1. Na página inicial, role até a seção **"Mapa de Instituições"**
2. Clique nos marcadores no mapa para ver detalhes
3. Use os filtros para encontrar instituições específicas

#### 4. Buscar e Doar para Demandas

1. Na página inicial, visualize todas as demandas ativas
2. Use a **barra de busca** para filtrar por palavra-chave
3. Filtre por **instituição** ou **categoria**
4. Clique em **"Ver Detalhes"** em uma demanda
5. Leia as informações sobre a necessidade
6. Clique em **"Quero Doar"**
7. Confirme sua intenção de doação
8. Entre em contato com a instituição pelos dados exibidos

#### 5. Visualizar Histórico de Doações

1. Acesse **"Meu Perfil"** no menu
2. Veja suas doações realizadas
3. Acompanhe o status de cada doação

### Para Instituições

#### 1. Criar uma Conta

1. Acesse a página inicial
2. Clique em **"Cadastrar"** no menu superior
3. Selecione **"Sou Instituição"**
4. Preencha os dados obrigatórios:
   - Nome da instituição
   - Email institucional
   - Senha
   - Endereço completo
   - Telefone de contato
   - Descrição da instituição
5. Clique em **"Cadastrar"**

#### 2. Fazer Login

1. Clique em **"Entrar"** no menu
2. Selecione **"Login Instituição"**
3. Digite email e senha
4. Clique em **"Entrar"**

#### 3. Criar uma Demanda

1. No menu, acesse **"Portal da Instituição"**
2. Clique em **"Criar Nova Demanda"**
3. Preencha os campos:
   - **Título**: Nome curto da necessidade
   - **Categoria**: Selecione (Alimentos, Roupas, etc)
   - **Descrição**: Detalhe o que precisa
   - **Quantidade**: Descreva a quantidade necessária
   - **Nível de Urgência**: Baixa, Média ou Alta
   - **Prazo**: Data desejada para receber
   - **Meta Numérica**: Quantidade específica (opcional)
4. Clique em **"Criar Demanda"**

#### 4. Gerenciar Demandas

1. Acesse **"Minhas Demandas"**
2. Visualize todas as demandas criadas
3. Para editar: clique em **"Editar"**
4. Para excluir: clique em **"Excluir"** (marca como inativa)
5. Acompanhe quantas pessoas manifestaram interesse

#### 5. Visualizar Doações Recebidas

1. Acesse **"Portal da Instituição"**
2. Veja a lista de doações recebidas
3. Entre em contato com os doadores
4. Atualize o status das doações

#### 6. Atualizar Perfil

1. Acesse **"Meu Perfil"**
2. Clique em **"Editar Perfil"**
3. Atualize informações como:
   - Endereço
   - Telefone
   - Descrição
   - Foto de perfil
4. Clique em **"Salvar"**

---

## Documentação da API

### Base URL

```
Local: http://localhost:8080/api
Produção: https://seu-dominio.com/api
```

### Endpoints Públicos

#### Autenticação

```http
POST /usuarios/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "senha123"
}

Response: 200 OK
{
  "id": 1,
  "nome": "Nome do Usuário",
  "email": "usuario@example.com",
  "tipo": "DOADOR",
  "token": "eyJhbGc..."
}
```

#### Cadastro de Doador

```http
POST /doadores
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}

Response: 201 Created
```

#### Cadastro de Instituição

```http
POST /instituicoes
Content-Type: application/json

{
  "nome": "Casa da Esperança",
  "email": "contato@casa.org",
  "senha": "senha123",
  "endereco": "Rua ABC, 123",
  "telefone": "11987654321",
  "descricao": "ONG que atende famílias carentes",
  "latitude": -23.550520,
  "longitude": -46.633308
}

Response: 201 Created
```

#### Listar Demandas

```http
GET /demandas
Response: 200 OK
[
  {
    "id": 1,
    "titulo": "Roupas de Inverno",
    "categoria": "Roupas",
    "descricao": "Precisamos de casacos e cobertores",
    "quantidadeDescricao": "50 itens",
    "nivelUrgencia": "Alta",
    "prazoDesejado": "2024-12-31",
    "metaNumerica": 50,
    "status": "ABERTA",
    "instituicao": {
      "id": 5,
      "nome": "Casa da Esperança"
    }
  }
]
```

#### Buscar Demanda por ID

```http
GET /demandas/{id}
Response: 200 OK
```

#### Listar Instituições

```http
GET /instituicoes
Response: 200 OK
```

### Endpoints Autenticados

*Requer header:* `Authorization: Bearer {token}`

#### Criar Demanda

```http
POST /demandas
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Alimentos Não Perecíveis",
  "categoria": "Alimentos",
  "descricao": "Cestas básicas para 30 famílias",
  "quantidadeDescricao": "30 cestas",
  "nivelUrgencia": "Alta",
  "prazoDesejado": "2024-12-15",
  "metaNumerica": 30,
  "instituicaoId": 5
}

Response: 201 Created
```

#### Atualizar Demanda

```http
PUT /demandas/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

#### Deletar Demanda

```http
DELETE /demandas/{id}
Authorization: Bearer {token}
Response: 204 No Content
```

#### Registrar Intenção de Doação

```http
POST /doacoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "doadorId": 3,
  "demandaId": 1
}

Response: 201 Created
```

#### Upload de Foto de Perfil

```http
POST /instituicoes/{id}/foto
Authorization: Bearer {token}
Content-Type: multipart/form-data

foto: [arquivo de imagem]

Response: 200 OK
{
  "fotoUrl": "/api/images/uuid.jpg"
}
```

---

## Banco de Dados

### Modelo Entidade-Relacionamento

```
┌──────────────┐
│   usuarios   │
├──────────────┤
│ id (PK)      │
│ nome         │
│ email (UK)   │
│ senha        │
│ dtype        │
└──────┬───────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
┌──────▼──────┐   ┌──────▼────────┐        │
│  doadores   │   │ instituicoes  │        │
├─────────────┤   ├───────────────┤        │
│ id (PK,FK)  │   │ id (PK,FK)    │        │
└─────────────┘   │ endereco      │        │
                  │ telefone      │        │
                  │ latitude      │        │
                  │ longitude     │        │
                  │ descricao     │        │
                  │ foto_url      │        │
                  └───────┬───────┘        │
                          │                │
                    ┌─────▼────────┐       │
                    │  demandas    │       │
                    ├──────────────┤       │
                    │ id (PK)      │       │
                    │ titulo       │       │
                    │ categoria    │       │
                    │ descricao    │       │
                    │ status       │       │
                    │ instituicao_id (FK)  │
                    └──────┬───────┘       │
                           │               │
                    ┌──────▼─────────┐     │
                    │    doacoes     │     │
                    ├────────────────┤     │
                    │ id (PK)        │     │
                    │ doador_id (FK) ├─────┘
                    │ demanda_id (FK)│
                    │ data           │
                    │ status         │
                    └────────────────┘
```

### Tabelas Principais

#### usuarios
- Tabela base com herança JOINED
- Armazena dados comuns (email, senha, nome)

#### doadores
- Herda de `usuarios`
- Representa pessoas físicas que fazem doações

#### instituicoes
- Herda de `usuarios`
- Organizações que recebem doações
- Campos adicionais: endereço, telefone, coordenadas GPS

#### demandas
- Necessidades publicadas pelas instituições
- Status: ABERTA, ATENDIDA, CANCELADA
- Relacionamento N:1 com instituições

#### doacoes
- Registro de intenções de doação
- Relaciona doadores com demandas
- Status: Aguardando, Confirmada, Recebida

---

## Segurança

### Medidas Implementadas

- **Criptografia de Senhas**: BCrypt com salt para hash de senhas
- **Autenticação por Token**: Sistema de tokens para sessões
- **CORS Configurado**: Proteção contra requisições não autorizadas
- **Validação de Dados**: Validação server-side de todos os inputs
- **SQL Injection**: Prevenido pelo uso de JPA/Hibernate
- **HTTPS**: Recomendado para produção
- **Variáveis de Ambiente**: Credenciais sensíveis não versionadas

### Boas Práticas

- Senhas nunca são retornadas nas respostas da API
- Tokens têm tempo de expiração
- Logs não contêm informações sensíveis
- Dependências mantidas atualizadas

---

## Testes Automatizados

### Estratégia de Testes

O projeto utiliza **testes unitários** para validar a lógica de negócio das camadas de serviço do backend. Os testes são executados automaticamente via **GitHub Actions** a cada commit ou pull request.

### Estrutura dos Testes

#### Backend (JUnit 5 + Mockito)
- **Framework**: JUnit 5
- **Mocking**: Mockito
- **Cobertura**: Camada de serviços (business logic)

#### Frontend (Validação)
- **Lint**: ESLint para qualidade de código
- **Build**: Validação de compilação com Vite

### Casos de Teste

#### 1. DoadorServiceTest
Testa o serviço de gerenciamento de doadores:

| Caso de Teste | Descrição | Validação |
|--------------|-----------|-----------|
| `deveCriptografarSenhaAoCadastrar` | Verifica se a senha é criptografada com BCrypt ao cadastrar doador | Senha armazenada deve ser hash |
| `deveLancarExcecaoQuandoEmailJaExiste` | Valida que não é possível cadastrar doador com email duplicado | Exceção com mensagem "Usuário já existente" |

#### 2. InstituicaoServiceTest
Testa o serviço de gerenciamento de instituições:

| Caso de Teste | Descrição | Validação |
|--------------|-----------|-----------|
| `deveCadastrarInstituicaoComSenhaCriptografada` | Verifica criptografia de senha ao cadastrar instituição | Senha deve ser hash |
| `deveLancarExcecaoQuandoCamposObrigatoriosAusentes` | Valida que campos obrigatórios são verificados | Exceção com "Dados inválidos" |

#### 3. DemandaServiceTest
Testa o serviço de gerenciamento de demandas:

| Caso de Teste | Descrição | Validação |
|--------------|-----------|-----------|
| `deveCriarDemandaComStatusPadraoQuandoDadosValidos` | Verifica criação de demanda com status inicial "Ativo" | Status = "Ativo", instituição associada |
| `deveLancarExcecaoQuandoCamposObrigatoriosAusentes` | Valida campos obrigatórios da demanda | Exceção com "Dados inválidos" |
| `deveLancarExcecaoQuandoInstituicaoNaoExiste` | Verifica validação de instituição existente | Exceção "Instituição não encontrada" |
| `deveFiltrarDemandasInativasAoBuscarTodas` | Testa filtro de demandas ativas | Retorna apenas demandas ativas |
| `deveMarcarDemandaComoInativaAoExcluir` | Verifica exclusão lógica (soft delete) | Status alterado para "Inativo" |

#### 4. DoacaoServiceTest
Testa o serviço de registro de doações:

| Caso de Teste | Descrição | Validação |
|--------------|-----------|-----------|
| `deveRegistrarIntencaoComDadosBasicos` | Verifica criação de intenção de doação | Doador e demanda associados, status "Aguardando" |
| `deveLancarExcecaoQuandoDoadorNaoEncontrado` | Valida existência do doador | Exceção com mensagem "Doador" |
| `deveAtualizarStatusDaDoacao` | Testa atualização de status da doação | Status alterado corretamente |

### Executar Testes Localmente

#### Backend (Testes Unitários)
```bash
cd backend
./mvnw clean test
```

Relatórios são gerados em: `backend/target/surefire-reports/`

#### Frontend (Lint + Build)
```bash
cd frontend
npm run lint
npm run build
```

### CI/CD - GitHub Actions

Os testes são executados automaticamente através do workflow `.github/workflows/tests.yml`:

**Triggers:**
- Push em qualquer branch
- Pull requests para master

**Jobs:**
1. **backend-tests**: Executa testes JUnit do backend
2. **frontend-validation**: Executa lint e build do frontend

**Visualização:**
- Acesse a aba **Actions** no repositório GitHub
- Cada commit mostra o status dos testes (sucesso/falha)

### Tecnologias de Teste

| Ferramenta | Uso |
|-----------|-----|
| JUnit 5 | Framework de testes para Java |
| Mockito | Criação de mocks para dependências |
| Spring Boot Test | Configuração de contexto de testes |
| ESLint | Análise estática de código JavaScript |
| GitHub Actions | Automação de CI/CD |

---

<div align="center">


[Voltar ao topo](#achados-e-doados---plataforma-de-doações)
