# Thai 18+ Chat App (Prototype)

A minimal Expo React Native prototype that demonstrates:
- Age 18+ consent checkbox gate
- Thai-only UI with explicit street-language tone
- Mode selector (เช่น โหมด NTR, โหมดแฟน)
- Local chat UI (mocked, no backend) with 18+ explicit phrasing
- Image upload button (local-only preview for appearance memory)

## Run
```bash
npm install
npm start
```

## Web (preview)
Run the web build/dev server so the browser shows the UI instead of the Expo manifest JSON:
```bash
npm run web
```

## Web (production)
```bash
npm run build:web
```
Serve the generated `dist/` folder with any static file host.

> This is a UI-only prototype. Connect your own AI backend and moderation layer before production use.
