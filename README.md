# Batya's Kosher Korean Kitchen — Website

Static marketing site for a kosher Korean cooking workshop in Hashmonaim, Israel.

## What's here
- `index.html` — home page (menu, sample menus, Korean food culture, kosher info, WhatsApp join + QR)
- `recipes.html` — full recipes for every dish (linked from each menu card)
- `recipe-book.pdf` — downloadable participant recipe book
- `what-to-bring.pdf` — downloadable "what to bring" checklist
- `img/` — logo, banner, dish photos, recipe posters, WhatsApp QR

No build step — it's a static site.

## Deploy to Vercel (target: kosher-korean-cooking.vercel.app)
1. Push this folder to a GitHub repo, e.g. `kosher-korean-cooking`.
2. On vercel.com → Add New → Project → import that repo.
3. Framework preset: **Other** (no build). Output dir: `/` (root).
4. After the first deploy, open Project → Settings → Domains and set the
   production domain to `kosher-korean-cooking.vercel.app`.

### Or deploy with the Vercel CLI (no GitHub needed)
```bash
npm i -g vercel
cd this-folder
vercel --prod   # first run asks you to log in, then deploys
# then: vercel project set name to "kosher-korean-cooking" for the .vercel.app subdomain
```
