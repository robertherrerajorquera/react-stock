import { createServer, type Server } from "node:http";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AddressInfo } from "node:net";
import puppeteer, { type Browser } from "puppeteer";
import { lessons } from "../src/data/lessons";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

// SITE_URL: dominio real de producción (Vercel). Se puede sobrescribir con la
// variable de entorno SITE_URL. Canonical, Open Graph y sitemap salen de aquí.
const SITE_URL = (process.env.SITE_URL ?? "https://react-stock-amber.vercel.app")
  .replace(/\/+$/, "");

interface PageMeta {
  route: string;
  title: string;
  description: string;
}

const siteTitle =
  "React Stock Lab — Curso interactivo de React con estética Windows 95";
const siteDescription =
  "Aprende React en español con 14 lecciones interactivas: JSX, componentes, props, useState, useEffect, Context y useReducer con estética Windows 95.";

const buildMetas = (): PageMeta[] => [
  { route: "/", title: siteTitle, description: siteDescription },
  ...lessons
    .filter((_, index) => index > 0)
    .map(
      (lesson): PageMeta => ({
        route: `/leccion/${lesson.id}`,
        title: `${lesson.title} — React Stock Lab`,
        description: `${lesson.title}: ${lesson.category} en React Stock Lab, curso interactivo de React en español con estética Windows 95.`,
      })
    ),
];

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const injectSeo = (html: string, meta: PageMeta): string => {
  const url = `${SITE_URL}${meta.route === "/" ? "/" : meta.route}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);

  let out = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${title}</title>`
  );
  out = out.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${description}" />`
  );
  out = out.replace(/<!-- seo:begin -->[\s\S]*?<!-- seo:end -->\s*/g, "");

  const block = `<!-- seo:begin -->
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="React Stock Lab" />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <!-- seo:end -->`;

  return out.replace("</head>", `  ${block}\n  </head>`);
};

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const startServer = (): Promise<{ server: Server; origin: string }> =>
  new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const pathname = decodeURIComponent(
          new URL(req.url ?? "/", "http://localhost").pathname
        );
        let filePath = path.join(DIST, pathname);
        try {
          const info = await stat(filePath);
          if (info.isDirectory()) {
            filePath = path.join(filePath, "index.html");
          }
        } catch {
          filePath = path.join(DIST, "index.html");
        }
        const data = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": MIME[path.extname(filePath)] ?? "application/octet-stream",
        });
        res.end(data);
      } catch (error) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(String(error));
      }
    });

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });

const renderOgImage = async (browser: Browser): Promise<void> => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(
    `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; box-sizing: border-box; font-family: "Segoe UI", Tahoma, sans-serif; }
  body { width: 1200px; height: 630px; background: #008080; display: flex; align-items: center; justify-content: center; }
  .win { width: 940px; background: #c0c0c0; border: 2px solid; border-color: #fff #000 #000 #fff;
    box-shadow: inset -2px -2px #808080, inset 2px 2px #dfdfdf, 8px 8px 0 rgba(0, 0, 0, 0.35); }
  .bar { background: #000080; color: #fff; padding: 12px 16px; font-size: 30px; font-weight: bold;
    display: flex; justify-content: space-between; align-items: center; }
  .bar span:last-child { background: #c0c0c0; color: #000; font-size: 22px; font-weight: normal;
    border: 2px solid; border-color: #fff #000 #000 #fff; padding: 0 12px; }
  .body { padding: 40px 44px; }
  .body h1 { font-size: 50px; color: #000; margin-bottom: 18px; }
  .body p { font-size: 26px; color: #333; line-height: 1.45; }
  .tag { display: inline-block; margin-top: 24px; background: #000080; color: #fff; padding: 10px 18px; font-size: 24px; }
</style>
</head>
<body>
  <div class="win">
    <div class="bar"><span>React Stock Lab</span><span>_ □ X</span></div>
    <div class="body">
      <h1>Curso interactivo de React</h1>
      <p>14 lecciones: JSX, props, useState, useEffect, Context y useReducer — con estética Windows 95.</p>
      <div class="tag">Aprende React en español</div>
    </div>
  </div>
</body>
</html>`,
    { waitUntil: "load" }
  );
  await page.screenshot({ path: path.join(DIST, "og.png") });
  await page.close();
};

const main = async () => {
  const metas = buildMetas();
  const { server, origin } = await startServer();
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error") pageErrors.push(message.text());
    });

    const rendered = new Map<string, string>();

    for (const meta of metas) {
      await page.goto(`${origin}${meta.route}`, { waitUntil: "networkidle0" });
      await page.waitForSelector(".win95-taskbar", { timeout: 20000 });
      await page.waitForSelector("h1", { timeout: 20000 });

      // React serializa los textos JSX adyacentes con separadores `<!-- -->`
      // para que el parser HTML no los funda en un solo nodo. El render de
      // cliente no los genera, así que los insertamos antes de capturar.
      await page.evaluate(() => {
        const root = document.getElementById("root");
        if (!root) return;
        for (const el of [root, ...root.querySelectorAll("*")]) {
          let prev: ChildNode | null = null;
          for (const child of Array.from(el.childNodes)) {
            if (
              prev !== null &&
              prev.nodeType === Node.TEXT_NODE &&
              child.nodeType === Node.TEXT_NODE
            ) {
              el.insertBefore(document.createComment(""), child);
            }
            prev = child;
          }
        }
      });

      rendered.set(meta.route, injectSeo(await page.content(), meta));
      console.log(`[prerender] renderizada ${meta.route}`);
    }

    await renderOgImage(browser);

    for (const [route, html] of rendered) {
      const out =
        route === "/"
          ? path.join(DIST, "index.html")
          : path.join(DIST, route.slice(1), "index.html");
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, html, "utf8");
    }

    // Segunda pasada: el servidor ya sirve el HTML escrito, así que esta carga
    // ejercita el camino real del visitante (hidratación sobre contenido prerenderado).
    const verifyErrors: string[] = [];
    const verifyPage = await browser.newPage();
    await verifyPage.setViewport({ width: 1280, height: 800 });
    verifyPage.on("pageerror", (error) => verifyErrors.push(String(error)));
    verifyPage.on("console", (message) => {
      if (message.type() === "error") verifyErrors.push(message.text());
    });

    for (const meta of metas) {
      await verifyPage.goto(`${origin}${meta.route}`, {
        waitUntil: "networkidle0",
      });
      const heading = await verifyPage.$eval("h1", (el) => el.textContent ?? "");
      const hasTaskbar = await verifyPage.$(".win95-taskbar") !== null;
      if (heading.trim() === "" || !hasTaskbar) {
        verifyErrors.push(`${meta.route}: la verificación de contenido falló`);
      }
    }
    await verifyPage.close();

    const today = new Date().toISOString().slice(0, 10);
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${metas
  .map((meta) => {
    const loc = `${SITE_URL}${meta.route === "/" ? "/" : meta.route}`;
    const priority = meta.route === "/" ? "1.0" : "0.8";
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;
    await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
    await writeFile(
      path.join(DIST, "robots.txt"),
      `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      "utf8"
    );

    if (pageErrors.length > 0) {
      console.warn(
        `[prerender] avisos de consola en el render (${pageErrors.length}):\n` +
          pageErrors.join("\n")
      );
    }

    if (verifyErrors.length > 0) {
      console.warn(
        `[prerender] ⚠ avisos en la verificación de hidratación (${verifyErrors.length}):\n` +
          verifyErrors.join("\n")
      );
    } else {
      console.log("[prerender] verificación de hidratación ✓ sin errores");
    }

    console.log(
      `[prerender] listo: ${metas.length} páginas + sitemap.xml + robots.txt + og.png`
    );
  } finally {
    await browser.close();
    server.close();
  }
};

main().catch((error) => {
  console.error("[prerender] error:", error);
  process.exitCode = 1;
});
