
# Best Auth - Tutorial de Autenticação com Next.js e Better Auth

Este projeto demonstra a implementação de um sistema de autenticação completo usando Next.js 14 e Better Auth.

## Configuração do Projeto

### 1. Instalação das Dependências

```bash
npm install better-auth @prisma/client @hookform/resolvers zod react-hook-form
npm install -D prisma
```

### 2. Configuração do Banco de Dados

1. Crie um container Docker MySQL:
```bash
docker run --name best-auth-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=best-auth \
  -e MYSQL_USER=best-auth \
  -e MYSQL_PASSWORD=best-auth \
  -p 3306:3306 \
  -d mysql:8
```

2. Configure o arquivo `.env`:
```env
DATABASE_URL="mysql://best-auth:best-auth@localhost:3306/best-auth"
BETTER_AUTH_SECRET=seu_secret_aqui
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Configuração do Prisma

1. Crie o schema do Prisma (`prisma/schema.prisma`):
```prisma
model User {
  id            String    @id
  email         String    @unique
  name          String?
  emailVerified Boolean
  image         String?   @db.Text
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]

  @@map("user")
}

// ... outros modelos (Session, Account, Verification)
```

2. Execute a migração:
```bash
npx prisma generate
npx prisma db push
```

## Implementação da Autenticação

### 1. Configuração do Better Auth

1. Configure o adapter do Prisma (`src/lib/prisma.ts`):
```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
```

2. Configure o Better Auth (`src/lib/auth.ts`):
```typescript
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapter/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'mysql' }),
  emailAndPassword: {
    enabled: true,
  },
});
```

3. Configure o cliente do Better Auth (`src/lib/auth-client.ts`):
```typescript
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient();
```

### 2. Implementação das Rotas de Autenticação

1. Crie a rota de API (`src/app/api/auth/[...all]/route.ts`):
```typescript
import { auth } from '@/lib/auth';
import { createAuthRouteHandler } from 'better-auth/adapter/next';

const handler = createAuthRouteHandler(auth);

export { handler as GET, handler as POST };
```

### 3. Uso da Autenticação

#### No Lado do Servidor

```typescript
// Em qualquer Server Component
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({
  headers: await headers(),
});

const user = session?.user;
```

#### No Lado do Cliente

```typescript
// Em qualquer Client Component
import { authClient } from '@/lib/auth-client';

// Login
const { data, error } = await authClient.signIn.email({
  email,
  password,
  callbackURL: 'http://localhost:3000/sign-in',
});

// Registro
const { data, error } = await authClient.signUp.email({
  email,
  password,
  name,
  callbackURL: 'http://localhost:3000/sign-in',
});
```

### 4. Logout

```typescript
// No lado do servidor
await auth.api.signOut({ headers: await headers() });

// Usando um form action
<form
  action={async () => {
    'use server';
    await auth.api.signOut({ headers: await headers() });
    redirect('/');
  }}
>
  <button type="submit">Sair</button>
</form>
```

## Fluxo do Projeto

1. **Página Inicial (`/`):**
   - Verifica se existe uma sessão
   - Mostra informações do usuário se logado
   - Mostra link para login se não logado

2. **Página de Login (`/sign-in`):**
   - Formulário com email e senha
   - Usa react-hook-form para validação
   - Integração com Better Auth para autenticação
   - Redirecionamento após sucesso

3. **Página de Registro (`/sign-up`):**
   - Formulário com nome, email e senha
   - Validação com react-hook-form e zod
   - Integração com Better Auth para criação de conta
   - Redirecionamento após sucesso

4. **Componentes Compartilhados:**
   - Toast notifications para feedback
   - Formulários estilizados com Tailwind
   - Componentes UI reutilizáveis

## Dicas

1. Use o hook `useToast` para feedback visual
2. Implemente validações adequadas com zod
3. Mantenha as credenciais seguras no `.env`
4. Use Server Components quando possível
5. Implemente proteção de rotas baseada na sessão
