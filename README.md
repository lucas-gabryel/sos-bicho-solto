# SOS Bicho Solto | Frontend

Aplicação WEB SPA para gestão de animais resgatados, desenvolvida com Next.js. 

## 💻 Tech Stack
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript (Strict Mode)
- **Estilização:** Tailwind CSS + Shadcn/UI
- **State/Data Fetching:** TanStack Query (React Query)
- **Formulários:** React Hook Form + Zod
- **Notificações:** Sonner/Toast (Shadcn)
- **Package Manager:** pnpm

## ⚙️ Setup Local

```bash
git clone <repo-url>
cd sos-bicho-solto
pnpm install
pnpm dev
```
> **Nota:** Instale as extensões do VS Code recomendadas no .vscode/extensions.json. O Prettier formatará o código no Ctrl + S.

## 📐 Arquitetura e Padrões

1. **Tipagem:** Uso de any é terminantemente proibido. Interfaces em @/types.
2. **Nomenclatura:** Arquivos em kebab-case (ex: animal-form.tsx).
3. **CI/CD:** O deploy na Vercel falhará se houver erros de Lint ou TypeScript.

### Estrutura de Pastas
```text
src/
├── app/
│   ├── (private)/
│   │   └── animais/
│   │       ├── _components/   # Componentes exclusivos desta página
│   │       └── page.tsx
├── components/
│   └── ui/                    # Apenas componentes base do Shadcn CLI
├── hooks/                     # Custom hooks (ex: useAnimais)
├── lib/                       # Utils (Tailwind merge, axios config)
└── repositories/              # Mocks/Serviços de API
```

### Padrão Mock -> API
Mantenha a abstração em 3 camadas para facilitar a futura integração com o backend:
1. repositories/animais.ts: Retorna a Promise com o Mock.
2. hooks/use-animais.ts: Faz o wrap do repositório no useQuery / useMutation.
3. app/.../page.tsx: Consome apenas o hook.

## 🌿 Git Flow

- **Branch Base:** main (Produção).
- **Branches de Feature:** feat/<nome-da-task> (ex: feat/login-page).
- **Commits:** Conventional Commits em inglês (ex: feat: implement zod validation on login).
- Integração via **Pull Request (PR)**.

---