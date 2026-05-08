# Landing Page Glicnutri - HTML Puro

Projeto reorganizado a partir de um arquivo HTML único.

## Estrutura

```text
index.html
assets/
  css/
    style.css
  js/
    script.js
  img/
    imagens extraídas do HTML original
  fonts/
    qanelas/
```

## Como abrir localmente

Abra o arquivo `index.html` no navegador.

## Como publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel, clique em `Add New Project`.
3. Importe o repositório do GitHub.
4. Configure assim:
   - Framework Preset: Other
   - Build Command: deixe vazio
   - Output Directory: `.`
5. Clique em `Deploy`.

## Observações

- O CSS foi separado em `assets/css/style.css`.
- O JavaScript foi separado em `assets/js/script.js`.
- As imagens em base64 foram convertidas para arquivos reais dentro de `assets/img/`.
- As fontes Qanelas não estavam anexadas ao arquivo original. Caso você tenha os arquivos `.woff2` ou `.woff`, coloque-os em `assets/fonts/qanelas/`.
- A página mantém fallback para Google Font, então funciona mesmo sem os arquivos Qanelas locais.


## Rastreamento instalado

Esta versão contém:

- Meta Pixel: `3723947677911523`
- Google Tag: `GT-57ZV22LW`
- Google Ads: `AW-16822994937`
- Eventos da landing:
  - Meta Pixel: `PageView`, `ViewContent`, `Lead`
  - Meta CAPI: `ViewContent`, `Lead`
  - Google: `view_item`, `click_cta_glicprotein`

## Configurar Conversions API na Vercel

O token da Conversions API não fica no código. Configure na Vercel:

1. Abra o projeto na Vercel.
2. Vá em `Settings` > `Environment Variables`.
3. Crie as variáveis:
   - `META_PIXEL_ID` = `3723947677911523`
   - `META_CAPI_TOKEN` = cole o token da Conversions API
   - opcional para teste: `META_TEST_EVENT_CODE` = código de teste do Events Manager
4. Salve em Production, Preview e Development se quiser testar em todos os ambientes.
5. Faça um novo deploy.

## Configurar cross-domain no GA4/Google Tag

No GA4/Google Tag, adicione estes domínios na configuração de domínios:

- `glicproteinvd2.vercel.app`
- `glicnutri.com`

## Observação sobre Google Ads Purchase

A landing rastreia clique no CTA. Para conversão de compra, o evento `Purchase` deve continuar instalado no e-commerce/checkout com valor e moeda.
