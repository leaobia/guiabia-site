# Site do Bia (Next.js)

Rotas: `/` (apresentação) e `/vagas/[id]` (página que o link compartilhado abre quando o app não intercepta).

## Antes do deploy
Edite `public/.well-known/assetlinks.json`: coloque o package name do app e o SHA-256 da keystore do APK (`eas credentials`).

## Rodar local
```bash
npm install
npm run dev
```
