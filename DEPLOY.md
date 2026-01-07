# Deploy no Coolify via Docker

Este guia explica como fazer o deploy da aplicação Gestão do Bem no Coolify usando Docker.

## 📋 Pré-requisitos

- Conta no Coolify configurada
- Repositório Git com o código da aplicação
- Banco de dados MySQL/MariaDB acessível

## 🚀 Deploy no Coolify

### 1. Configurar o Projeto no Coolify

1. Acesse seu painel do Coolify
2. Crie um novo projeto
3. Selecione "Docker Compose" como tipo de deploy
4. Conecte ao seu repositório Git

### 2. Configurar Variáveis de Ambiente

No Coolify, adicione as seguintes variáveis de ambiente:

```env
# Database
DB_HOST=seu_host_database
DB_PORT=3306
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=gestaodobem

# JWT
JWT_SECRET=seu_jwt_secret_seguro

# Frontend (URL do backend em produção)
VITE_API_URL=https://seu-backend.dominio.com
```

### 3. Configurar Build

O Coolify detectará automaticamente o `docker-compose.yml` na raiz do projeto.

**Configurações recomendadas:**
- **Build Pack:** Docker Compose
- **Port Mapping:** 
  - Backend: 3000
  - Frontend: 80
- **Health Check:** Habilitado

### 4. Deploy

Clique em "Deploy" no Coolify. O processo irá:

1. Clonar o repositório
2. Construir as imagens Docker do backend e frontend
3. Iniciar os containers
4. Verificar health checks
5. Tornar a aplicação disponível

## 🔧 Estrutura dos Arquivos Docker

### Backend (NestJS)
- `backend/Dockerfile` - Multi-stage build otimizado
- `backend/.dockerignore` - Arquivos excluídos da imagem

### Frontend (React + Vite)
- `frontend/Dockerfile` - Build + Nginx
- `frontend/nginx.conf` - Configuração do servidor web
- `frontend/.dockerignore` - Arquivos excluídos da imagem

### Orquestração
- `docker-compose.yml` - Orquestração dos serviços

## 🌐 URLs e Portas

### Desenvolvimento
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:8080` (dev) ou `http://localhost:80` (prod)

### Produção (Coolify)
- Backend: Será exposto pela URL configurada no Coolify
- Frontend: Será exposto pela URL configurada no Coolify

## 🔒 Segurança

### Variáveis Sensíveis
- **Nunca commite o arquivo `.env`** com credenciais reais
- Use o `.env.example` como template
- Configure as variáveis no painel do Coolify

### Geração do JWT_SECRET
```bash
# Gerar um secret aleatório seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🐛 Troubleshooting

### Container não inicia
1. Verifique os logs no Coolify
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique a conexão com o banco de dados

### Frontend não conecta ao Backend
1. Confirme que `VITE_API_URL` aponta para a URL correta do backend
2. Verifique CORS no backend
3. Confirme que o backend está acessível

### Erro de build
1. Limpe o cache de build no Coolify
2. Verifique se todas as dependências estão no `package.json`
3. Confira logs de erro durante o build

## 📦 Build Local (Teste)

Para testar o build localmente antes do deploy:

```bash
# Build e start com docker-compose
docker-compose up --build

# Acessar aplicação
# Frontend: http://localhost
# Backend: http://localhost:3000
```

## 🔄 Atualizações

O Coolify pode ser configurado para fazer deploy automático quando houver:
- Push na branch principal
- Novo commit
- Webhook do GitHub

## 📊 Monitoramento

O Coolify fornece:
- Logs em tempo real
- Métricas de CPU/Memória
- Status dos containers
- Health checks automáticos

## 🆘 Suporte

Para problemas específicos do Coolify:
- Documentação: https://coolify.io/docs
- Discord: https://coolify.io/discord
