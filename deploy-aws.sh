#!/bin/bash

# Script para build e deploy na AWS
# Uso: ./deploy-aws.sh [dev|prod]

set -e

ENV=${1:-prod}
echo "🚀 Iniciando deploy para ambiente: $ENV"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Fase 1: Build do Backend${NC}"
cd backend
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests
echo -e "${GREEN}✅ Backend build concluído${NC}"

echo -e "\n${YELLOW}📦 Fase 2: Build do Frontend${NC}"
cd ../frontend
echo "Installing dependencies..."
npm ci --legacy-peer-deps
echo "Building React application..."
npm run build
echo -e "${GREEN}✅ Frontend build concluído${NC}"

if [ "$ENV" = "dev" ]; then
    echo -e "\n${YELLOW}🐳 Fase 3: Deploy local com Docker${NC}"
    cd ..
    docker-compose up --build -d
    echo -e "${GREEN}✅ Aplicação rodando em:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend: http://localhost:8080"
    
elif [ "$ENV" = "prod" ]; then
    echo -e "\n${YELLOW}☁️  Fase 3: Preparando para deploy AWS${NC}"
    
    # Verificar se AWS CLI está instalado
    if ! command -v aws &> /dev/null; then
        echo "❌ AWS CLI não encontrado. Instale com: pip install awscli"
        exit 1
    fi
    
    echo -e "${YELLOW}Backend: Push para ECR ou deploy via EB${NC}"
    echo "1. Elastic Beanstalk: cd backend && eb deploy"
    echo "2. ECR/ECS: Execute os comandos do AWS_DEPLOY_GUIDE.md"
    
    echo -e "\n${YELLOW}Frontend: Upload para S3${NC}"
    echo "Execute: aws s3 sync frontend/dist/ s3://seu-bucket-frontend --delete"
    
    echo -e "\n${GREEN}✅ Builds prontos para deploy!${NC}"
    echo "Consulte AWS_DEPLOY_GUIDE.md para instruções detalhadas"
fi
