# hugo-guigo.github.io

Portfólio pessoal de Hugo Guilherme de Assis Paula: engenharia de ML aplicada e sistemas.

Site estático (HTML, CSS e um pouco de JS), bilíngue PT/EN, com tema claro/escuro. Sem build: o GitHub Pages serve os arquivos da branch `main` direto.

## Rodar localmente

```bash
python -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

- `index.html`: conteúdo. Cada texto traduzível tem um par `data-pt` / `data-en`.
- `style.css`: layout e temas.
- `main.js`: botões de idioma e tema (preferência salva no navegador).
