# hugo-guigo.github.io

Portfólio pessoal de Hugo Guilherme de Assis Paula: engenharia de ML aplicada e sistemas.

Site estático em HTML, CSS e JavaScript puros, bilíngue PT/EN, sem etapa de build. O GitHub Pages serve os arquivos da branch `main` direto.

## Rodar localmente

```bash
python -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

- `index.html`: conteúdo. Cada texto traduzível tem um par `data-pt` / `data-en`.
- `style.css`: layout, tipografia e animações (respeita `prefers-reduced-motion`).
- `main.js`: tela de entrada, troca de idioma, linha de terminal, fundo de rede, esfera de ferramentas e revelação ao rolar.
- `assets/hugo.jpg` (opcional): foto do card de perfil. Sem ela, o card mostra as iniciais.
