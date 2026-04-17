# AutoStore — Backend

API REST em Node.js + Express, autenticação via Firebase, imagens no Cloudinary, pagamentos via MercadoPago.

## Tecnologias

- Node.js (ESM)
- Express 4
- Firebase Admin SDK (Firestore + Auth)
- Cloudinary (upload de imagens)
- MercadoPago
- Multer (memoryStorage)
- Zod (validação)
- Swagger (documentação)

## Requisitos

- Node.js 18+
- Conta Firebase com Firestore ativado
- Conta Cloudinary
- Conta MercadoPago (para pagamentos)

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com seus dados

# 3. Colocar o serviceAccountKey.json na raiz do projeto
#    (baixe em Firebase Console → Configurações → Contas de serviço)

# 4. Iniciar em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3000`.

Documentação Swagger disponível em `http://localhost:3000/docs`.

## Deploy no Render

1. Conecte o repositório no [Render](https://render.com)
2. Use as configurações do `render.yaml` (já incluso)
3. Configure as variáveis de ambiente no painel do Render:
   - `FIREBASE_SERVICE_ACCOUNT_B64` — base64 do serviceAccountKey.json
     ```bash
     # Para gerar o base64:
     base64 -i serviceAccountKey.json | tr -d '\n'
     ```
   - `FRONTEND_URL` — URL do frontend no Vercel
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`
   - `APIBRASIL_BEARER_TOKEN`, `APIBRASIL_DEVICE_TOKEN`

## Estrutura

```
src/
├── config/
│   └── firebase.js          # Firebase Admin (única inicialização)
├── controllers/             # Lógica de cada rota
├── routes/                  # Definição das rotas Express
├── services/                # Regras de negócio
├── middlewares/
│   ├── authMiddleware.js    # Autenticação via Firebase ID Token
│   ├── upload.middleware.js # Multer memoryStorage → Cloudinary
│   ├── rateLimiter.js       # Rate limiting por tipo de rota
│   ├── validate.js          # Validação Zod
│   └── error.middleware.js  # Handler global de erros
├── repositories/            # Acesso ao Firestore
├── errors/
│   └── AppError.js          # Classe de erro customizada
├── utils/
│   └── logger.js            # Logger estruturado
├── docs/
│   └── swagger.js           # Configuração Swagger
├── app.js                   # Configuração Express + rotas
└── server.js                # Entry point (listen)
```

## Rotas principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /health | Health check |
| POST | /auth/register | Registrar usuário |
| GET | /search | Busca geral |
| GET | /plate-search | Busca por placa |
| GET | /chassi | Busca por chassi |
| GET /POST | /marketplaceParts | Marketplace de peças |
| GET /POST | /orders | Pedidos |
| POST | /payments | Pagamentos MP |
| GET /POST | /reviews | Avaliações |
| * | /admin | Rotas administrativas |
| GET | /docs | Swagger UI |
