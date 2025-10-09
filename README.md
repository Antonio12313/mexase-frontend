# 🖥️ Mexase Frontend

Frontend do sistema **Mexase**, desenvolvido em **Next.js + TypeScript**, que consome a API de gestão nutricional.  
Este projeto fornece as telas de **login**, **home**, e demais funcionalidades de interação com os dados de pacientes e nutricionistas.

---

## 🚀 Tecnologias Utilizadas

- **Next.js (App Router)**
- **TypeScript**
- **React**
- **TailwindCSS**
- **Shadcn/UI** (componentes UI)
- **Axios** (requisições HTTP)

---

## 📂 Estrutura do Projeto

```
mexase-frontend-main/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Página inicial
│   │   ├── login/page.tsx      # Página de login
│   │   ├── home/page.tsx       # Página principal após login
│   │   ├── layout.tsx          # Layout global
│   │   └── actions/auth.ts     # Funções de autenticação
│   ├── components/             # Componentes reutilizáveis
│   ├── lib/                   # Funções utilitárias
│   └── middleware.ts          # Middleware de autenticação
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## ⚙️ Configuração do Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias:

```env
NEXT_PUBLIC_API_URL=http://localhost:3030
```

- `NEXT_PUBLIC_API_URL`: URL da API backend (padrão: `http://localhost:3030`)

---

## ▶️ Como Rodar o Projeto

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/SEU-USUARIO/mexase-frontend.git
   cd mexase-frontend-main
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Rodar em modo desenvolvimento**:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em:  
   👉 `http://localhost:3000`

4. **Build para produção**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Autenticação

O login é feito via formulário (`login-form.tsx`).  
Após login bem-sucedido, o token JWT é armazenado (cookies ou localStorage) e utilizado em chamadas à API.  
O middleware (`src/middleware.ts`) garante proteção de rotas privadas.

---

## 📜 Scripts Disponíveis

```bash
npm run dev       # Rodar em ambiente de desenvolvimento
npm run build     # Compilar para produção
npm run start     # Iniciar servidor de produção
npm run lint      # Rodar linter do código
```

---

## 🛠️ Próximos Passos

- Melhorar UI das telas de login e home
- Integrar com todos os endpoints da API
- Criar dashboard para nutricionistas e pacientes
