# React Stock Lab — Plan de trabajo (PROGRESS.md)

> **Para cualquier nueva sesión:** leer primero este archivo completo, luego `Última sesión` y `Próximo paso`, y continuar marcando `[x]` en cada paso completado. Añadir notas en `Log de sesiones` al final de cada sesión.

---

## 0. Cómo usar este archivo

- `[ ]` = pendiente · `[x]` = completado · `[-]` = descartado / no aplica
- Cada paso se marca **solo después de verificarlo** (build, lint o revisión visual).
- Al terminar una sesión: actualizar **Última sesión**, **Fase actual** y **Próximo paso**.
- Si falta contexto: este archivo + la estructura de carpetas (sección 12) es suficiente para retomar.

---

## 1. Estado global

| Campo | Valor |
|---|---|
| Última sesión | 2026-09-24 — Errores corregidos + Fase 1–4 |
| Fase actual | Fase 5 — Tutorial |
| Próximo paso | Crear `src/lessons/` con las 14 lecciones y `TutorialWindow` real |
| Comando dev | `pnpm dev` (lockfile: pnpm) |
| Comando build | `pnpm build` (verificado ✓) |
| Comando lint | `pnpm lint` (verificado ✓) |
| Lenguaje | **TypeScript confirmado por el usuario (`.ts`/`.tsx` sí o sí)** |

### Fases

- [x] Fase 0 — Verificación del proyecto (decisión TS tomada, ver sección 2)
- [x] Fase 1 — Base (Tailwind, Motion, limpieza, variables Win95)
- [x] Fase 2 — Escritorio (Desktop, Taskbar, StartMenu, DesktopIcons)
- [x] Fase 3 — Ventana (Window, WindowTitleBar, WindowControls, drag, min/max/close)
- [x] Fase 4 — WindowContext (hecho directamente como Context, ver nota en sección 6)
- [ ] Fase 5 — Tutorial (14 lecciones + navegación + progreso) ← **ACTUAL**
- [ ] Fase 6 — Stock Manager (estático → useState → formularios → Context → useReducer)
- [ ] Fase 7 — Integración pedagógica (cada lección abre su resultado)
- [ ] Fase 8 — Code Editor (visor de código)
- [ ] Fase 9 — Refinamiento visual + responsive

---

## 2. ⚠️ Discrepancias detectadas — RESUELTAS (2026-09-24)

- [x] **Lenguaje decidido: TypeScript sí o sí** (confirmado por el usuario). Archivos `.ts`/`.tsx`.
- [x] **App.tsx reparado**: ya no contiene entrypoint duplicado; monta `WindowProvider > StockProvider > Desktop`. `main.tsx` es el único entrypoint. `react-router-dom` NO se usa (fuera de alcance v1).
- [x] **Borradores legacy eliminados**: `Taskbar.ts` (JSX en `.ts` = error de parseo), `Icon.ts` vacío, `windows/{InfoWindow,ProductoWindow,ReactWindow,StockWindow,WindowTemplate}.tsx`, hooks vacíos, `products.json` vacío, carpeta `lecciones/`, `styles/{globals,windowManager}.css`, `App.css`, assets del template (`hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`).
- [x] **Tailwind + Motion instalados y configurados** (`@tailwindcss/vite`, `motion`).
- [x] **`src/index.css`** reemplazado: `@import "tailwindcss";` + `./styles/windows95.css`.
- [x] **Lint corregido**: contexto separado en `WindowContext.ts` (contexto/tipos) + `WindowProvider.tsx` (componente) + `hooks/useWindowManager.ts` (hook) para no violar `react-refresh/only-export-components`.

### Notas de implementación (decisiones tomadas)

- **Fase 3 + 4 fusionadas**: el Window Manager se creó directamente dentro de `WindowProvider` (no hubo fase intermedia con props). La narrativa "refactorización props → Context" se cuenta en la lección 10 con código de ejemplo.
- **`moveWindow(id, x, y)` añadido** al contexto (el spec no lo lista, pero es necesario para que la posición sobreviva a minimizar/cerrar).
- **Posición (`x`, `y`) vive en el estado del Context**; tamaño (`width`/`height`) vive en `data/windows.ts`.
- **Menús superiores (Archivo/Editar/Ver/Curso/Ayuda)** movidos de Fase 2 → **Fase 5** (el menú `Curso` necesita los datos de las lecciones). Los menús de StockWindow/CodeEditorWindow son placeholders visuales.
- **Ventana Ayuda añadida** (`components/help/HelpWindow.tsx`): el spec la incluye en el menú Inicio pero no en la estructura de carpetas.
- **Botón "Nuevo producto"** existe pero `disabled` hasta la Fase 6 (formulario).
- **Stock bajo**: `stock < 5` → `BAJO` (`LOW_STOCK_THRESHOLD` en `data/products.ts`; Mouse=5 → OK, Monitor=2 → BAJO, según el mock).

### Pendientes conocidos (no bloqueantes)

- [ ] Responsive: tamaños/posiciones iniciales fijas — ajustar en Fase 9
- [ ] Task buttons con `min-width: 120px` — puede desbordar en pantallas pequeñas (Fase 9)
- [ ] Resize manual de ventanas: no implementado (no está en el spec de la v1)
- [ ] Animación de minimizar = exit (opacity/scale/y), no "vuelo" real a la taskbar — refinar en Fase 9
- [ ] Glyph `⏻` de "Apagar..." depende de la fuente del sistema

---

## 3. Fase 1 — Base

### 3.1 Verificación inicial

- [x] `cd react-stock` (raíz del proyecto — NO ejecutar `npm create vite@latest`)
- [x] Instalar deps: `pnpm install` (node_modules ya existe — verificar)
- [x] Arrancar dev server y comprobar que carga sin errores (dev + `tsc -b` + build ✓)

### 3.2 Tailwind CSS

- [x] Instalar: `pnpm add tailwindcss @tailwindcss/vite`
- [x] Configurar `vite.config.(js|ts)`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

- [x] En `src/index.css`: usar exactamente `@import "tailwindcss";`
- [x] Verificar que Tailwind aplica (clase de prueba; verificado en dist: capas `@layer theme, base, components, utilities` + utilidades `.flex`, `.w-full` generadas)

### 3.3 Motion

- [x] Instalar: `pnpm add motion`
- [x] Importar con: `import { motion } from "motion/react";`
- [x] Regla: Motion **solo** para ventanas (abrir/cerrar/minimizar/maximizar/drag) y efectos de menú. Botones/inputs/controles → CSS.

### 3.4 Limpieza y variables Win95

- [x] Limpiar `App.tsx` para que solo monte la app (es `.tsx`, no `.jsx`):

```jsx
function App() {
  return (
    <WindowProvider>
      <StockProvider>
        <Desktop />
      </StockProvider>
    </WindowProvider>
  );
}
```

- [x] Unificar entrypoint (`main.tsx` → `App.tsx`), eliminar código duplicado
- [x] Eliminar estilos/imports del template Vite que no se usen (`App.css`, variables `--accent`, etc.)
- [x] Crear `src/styles/windows95.css` con la paleta:

```css
:root {
  --win-desktop: #008080;
  --win-gray: #c0c0c0;
  --win-dark-gray: #808080;
  --win-black: #000000;
  --win-white: #ffffff;
  --win-blue: #000080;
  --win-input: #ffffff;
  --win-error: #ff0000;
  --win-success: #008000;
  --win-warning: #ffff00;
}
```

- [x] Crear estilos base:
  - [x] `.win95-button` (bevel outset 2 capas; `:active` → bevel inset, `border-radius: 0`)
  - [x] `.win95-input` (bevel inset, `border-radius: 0`)
  - [x] Bevels (`.win95-raised` / `.win95-sunken`), sombras duras, bordes de 1px
- [x] Tipografía: UI → `Arial, Tahoma, Verdana, sans-serif` (12px); código → `JetBrains Mono, monospace`
- [x] Verificar: `pnpm build` y `pnpm lint` sin errores

---

## 4. Fase 2 — Escritorio

- [x] `Desktop.tsx` — fondo `#008080`, layout, renderiza ventanas + taskbar
- [x] `DesktopIcons.tsx` — iconos del escritorio (selección con clic, doble clic abre ventanas)
- [x] `Taskbar.tsx`:
  - [x] Botón `[Inicio]` (con bandera CSS de 4 cuadrados + menú con backdrop para cerrar al hacer clic fuera)
  - [x] Botones por ventana abierta (restore/focus/minimizar según estado)
  - [x] Reloj (`18:14`) actualizado con `setInterval` (ejemplo temprano de `useEffect`)
- [x] `StartMenu.tsx`:

```
React Stock Lab
───────────────
📖 Tutorial
💻 Code Editor
📦 Stock Manager
❓ Ayuda
───────────────
Apagar...
```

- [-] Menús superiores de la app: `Archivo  Editar  Ver  Curso  Ayuda` — **MOVIDO A FASE 5** (el menú `Curso` necesita los datos de las lecciones)
- [ ] Verificación: escritorio visible, taskbar funcional, menú Inicio abre/cierra (dev server 200 ✓; falta revisión visual manual con `pnpm dev`)

---

## 5. Fase 3 — Ventanas (Window)

### 5.1 Componentes

- [x] `windows/Window.tsx` — props: `id`, `children` (título/icono/tamaño vienen de `data/windows.ts`); maneja posición, tamaño, estado activo, drag
- [x] `windows/WindowTitleBar.tsx`
  - [x] Icono + título + controles `_ □ X`
  - [x] Activa: `background: #000080; color: #fff` · Inactiva: `background: #808080`
  - [x] **Solo la title bar es draggable** (el contenido NO — se ignora el pointerdown sobre `<button>` para que los controles funcionen)
- [x] `windows/WindowControls.tsx` — botones cuadrados pequeños `_ □ X` (sin iconos modernos grandes; `❐` al estar maximizada)

### 5.2 Funcionalidad (en este orden)

- [x] Abrir (iconos del escritorio, menú Inicio, `openWindow`)
- [x] Cerrar (`X`)
- [x] Focus (zIndex al clickear; solo si no estaba activa)
- [x] Minimizar (`_`)
- [x] Maximizar (`□`)
- [x] Restaurar (`❐` / taskbar)
- [x] Drag (solo desde title bar, con `dragControls` de Motion; posición comprometida al contexto en `onDragEnd`)

### 5.3 Animaciones (Motion)

- [x] Apertura: `opacity 0→1`, `scale .92→1`, 150ms ✓
- [x] Cierre: `opacity 1→0`, `scale 1→.92`, 120ms ✓
- [x] Minimizar: exit animation (opacity/scale/y) 150ms — *mejorable: animación "vuelo" real a la taskbar en Fase 9*
- [x] Maximizar: `x, y` animadas por Motion (150ms) + `width, height` por transición CSS (150ms)
- [x] **NO animar**: botones, texto, tablas, elementos del tutorial (todo con CSS puro)

### 5.4 Window Manager (lógica)

- [x] Estructura de estado por ventana: `{ open, minimized, maximized, zIndex, x, y }`
- [x] Funciones: `openWindow()`, `closeWindow()`, `minimizeWindow()`, `maximizeWindow()`, `restoreWindow()`, `focusWindow()` (+ `moveWindow()`)
- [ ] Verificación: todas las acciones funcionan con las 3 ventanas *(falta prueba visual manual con `pnpm dev`)*

---

## 6. Fase 4 — WindowContext

- [x] Crear `src/context/WindowContext.ts` (tipos + `createContext`) + `src/context/WindowProvider.tsx`
- [x] La lógica del Window Manager vive directamente en el Context (sin fase intermedia de props)
- [x] Exponer: `{ windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, moveWindow }`
- [ ] La interfaz debe seguir funcionando **igual** (refactorización invisible) — *no aplica: se creó directo como Context*
- [x] Crear `src/hooks/useWindowManager.ts`:

```ts
export function useWindowManager(): WindowContextValue {
  const context = useContext(WindowContext);
  if (context === null) {
    throw new Error("useWindowManager debe usarse dentro de <WindowProvider>");
  }
  return context;
}
```

- [x] Nota pedagógica registrada: este refactor (props → Context) será demostrado en la lección 10

---

## 7. Fase 5 — Tutorial (14 lecciones)

### 7.1 Componentes

- [ ] `tutorial/TutorialWindow.jsx` — ventana con lección actual
- [ ] `tutorial/Lesson.jsx`
- [ ] `tutorial/LessonExplanation.jsx`
- [ ] `tutorial/LessonCode.jsx`
- [ ] `tutorial/LessonNavigation.jsx` — `[ ← Anterior ]` / `[ Siguiente → ]`
- [ ] `tutorial/LessonResult.jsx` — botón que abre la ventana de resultado vía `openWindow(...)` (el tutorial usa Context deliberadamente)
- [ ] Indicador de progreso: `Lección 7 de 14` + barra clásica `██████████░░░░ 50%` (sin border-radius moderno)
- [ ] Selector de lección desde menú `Curso` y desde Explorer lateral

### 7.2 Estructura de CADA lección (checklist por lección, sección 7.3)

Para cada una de las 14 lecciones:

- [ ] `¿Qué es?` — concepto general en React
- [ ] `¿Para qué sirve?` — problema que resuelve
- [ ] `Sintaxis` — cómo se implementa
- [ ] `Ejemplo simple` — código React pequeño aislado del proyecto
- [ ] `Ahora en Stock Manager` — cómo se usa en la app real
- [ ] `RESULTADO` — demostración visible (botón que abre la ventana correspondiente)
- [ ] `Código` — archivo(s) real(es) del proyecto relacionados (para Code Editor)
- [ ] Navegación anterior/siguiente funciona

### 7.3 Las 14 lecciones

#### Fundamentos

- [ ] **01 — JSX**
  - [ ] Explicación: JSX, `return`, elementos, expresiones `{}` en JS
  - [ ] Ejemplo: `<Product />` mostrando `Teclado / Stock: 10`
  - [ ] Resultado: abrir Stock Manager y ver el primer producto
- [ ] **02 — Componentes**
  - [ ] Ejemplo: `ProductRow`
  - [ ] División: `StockApp → Header, ProductTable → ProductRow, StockSummary`
  - [ ] Nota: dividir en componentes no mejora automáticamente; debe ayudar a organizar/reutilizar
- [ ] **03 — Props**
  - [ ] Ejemplo: `<ProductRow product={product} />`
  - [ ] Problema antes (acoplado a "Teclado/10") vs después (Teclado/Mouse/Monitor)
  - [ ] Resultado: cambiar datos cambia la interfaz

#### Estado

- [ ] **04 — useState**
  - [ ] Ejemplo: `const [stock, setStock] = useState(10);`
  - [ ] Aplicación: controles `[ - ] 10 [ + ]`
  - [ ] Resultado visible: 10 → 11 al pulsar +, explicar re-render por `setStock`
- [ ] **05 — Eventos**
  - [ ] `onClick`, `onChange`, `onSubmit`
  - [ ] Aplicación: +/- stock, seleccionar productos, abrir ventanas, enviar formularios
- [ ] **06 — Listas**
  - [ ] `products.map(...)` con `key={product.id}`
  - [ ] Resultado: agregar elemento → nueva fila automáticamente
- [ ] **07 — Formularios**
  - [ ] Controlled inputs: `value` + `onChange` + `onSubmit` + `preventDefault`
  - [ ] Resultado: escribir `Webcam / 8` → aparece fila `Webcam | 8`
- [ ] **08 — useEffect**
  - [ ] Ejemplo inicial: `document.title = \`Productos: ${products.length}\``
  - [ ] Resultado: al agregar producto, el título de la pestaña cambia
  - [ ] Aplicaciones mostradas: API, localStorage, suscripciones, event listeners
  - [ ] **Importante**: NO presentarlo como "el hook para ejecutar código cuando algo cambia" → es para **sincronizar con sistemas externos**

#### Estado compartido

- [ ] **09 — Prop Drilling**
  - [ ] Diagrama visual `App → StockPage → ProductTable → ProductRow` con `products` viajando
  - [ ] Nota pedagógica: prop drilling puede ser válido; el problema aparece cuando atraviesa muchos componentes que no lo usan
- [ ] **10 — Context**
  - [ ] `createContext` + `StockProvider`
  - [ ] Diagrama antes (props en cadena) vs después (Provider → Table/Form/Summary)
  - [ ] **Momento mágico**: mostrar que el propio React Stock Lab usa Context (`WindowContext` → `openWindow("stock")`)
  - [ ] Resultado: el usuario abre Stock Manager desde el tutorial
- [ ] **11 — useContext**
  - [ ] Las 3 piezas: `createContext → Provider → useContext`
  - [ ] Aplicación: ProductTable/StockSummary consumen `products`, ProductForm consume `addProduct`
  - [ ] Resultado: varias partes reaccionan al mismo estado
- [ ] **12 — Context + useState**
  - [ ] Provider con `addProduct`, `removeProduct` (y `updateStock`)
  - [ ] Resultado: agregar/eliminar/modificar y que distintas ventanas vean el mismo estado

#### Arquitectura

- [ ] **13 — useReducer**
  - [ ] Problema: multiplicación de funciones (`ADD_PRODUCT`, `REMOVE_PRODUCT`, `UPDATE_STOCK`, `CLEAR_STOCK`)
  - [ ] `useReducer(stockReducer, initialState)` + `dispatch({ type, payload })`
  - [ ] Flujo: evento → dispatch → action → reducer → nuevo state → render
- [ ] **14 — Context + useReducer**
  - [ ] `StockProvider` con `{ state, dispatch }`
  - [ ] Arquitectura: Provider → Table, Form, Summary, Alerts
  - [ ] Idea final: Context no es reemplazo universal de props; se usa cuando la info debe compartirse por distintas partes del árbol

### 7.4 Datos de lecciones

- [ ] Las lecciones viven como **datos** en `src/lessons/` (no JSX enorme en App)
- [ ] Formato por lección: `{ id, title, category, concept, explanation, code, result: { type, description } }`
- [ ] Categorías: `Fundamentos`, `Estado`, `Estado compartido`, `Arquitectura`
- [ ] Ventana Explorer lateral con carpetas 📁 React / Estado / Context / Arquitectura; doble clic abre la lección

---

## 8. Fase 6 — Stock Manager

### 8.1 Evolución (en este orden)

- [ ] 1. Datos estáticos: `initialProducts` (Teclado 10, Mouse 5, Monitor 2)
- [ ] 2. Componentes: `StockWindow, ProductTable, ProductRow, ProductForm, StockSummary, StockAlerts`
- [ ] 3. Props (`<ProductRow product={product} />`)
- [ ] 4. useState (`[ - ] stock [ + ]`)
- [ ] 5. Eventos (agregar/disminuir/seleccionar)
- [ ] 6. Listas (map + key)
- [ ] 7. Formularios (agregar producto: nombre + stock)
- [ ] 8. useEffect (p.ej. `document.title`)
- [ ] 9. Estado compartido (mover estado a `StockContext`)
- [ ] 10. Context + useState (`addProduct`, `removeProduct`, `updateStock`)
- [ ] 11. useReducer (`stockReducer`)
- [ ] 12. Context + useReducer (estado final)

### 8.2 Funcionalidad final

- [ ] Agregar producto (formulario)
- [ ] Eliminar producto
- [ ] Modificar stock (aumentar/disminuir)
- [ ] Detectar stock bajo (alerta `BAJO`)
- [ ] Cantidad de productos + stock total (resumen)
- [ ] Seleccionar producto
- [ ] Layout final:

```
[ ID | Producto | Stock | Estado ]
[ 01 | Teclado  | 10    | OK     ]
[ 02 | Mouse    |  5    | OK     ]
[ 03 | Monitor  |  2    | BAJO   ]
─────────────────────────────────
3 productos            Stock total: 17
```

- [ ] `src/context/StockContext.jsx` expone la versión actual correspondiente a la fase del curso
- [ ] `src/data/products.js` con los datos iniciales

---

## 9. Fase 7 — Integración pedagógica

- [ ] Cada lección tiene su botón de resultado (`[ Ver en Stock Manager ]`, `[ Probar ejemplo ]`, etc.)
- [ ] El botón usa `useContext(WindowContext)` → `openWindow("stock")`
- [ ] La ventana de destino se abre **y queda enfocada** (zIndex)
- [ ] La lección de useEffect muestra el cambio real (`document.title`)
- [ ] La lección de useState muestra el antes/después (`Stock: 10` → `Stock: 11`)
- [ ] "Momento mágico" de Context integrado (sección 7.3 lección 10)

---

## 10. Fase 8 — Code Editor

- [ ] `code/CodeEditorWindow.jsx` — visor con barra de menú (`Archivo  Editar  Buscar`)
- [ ] Muestra el código relevante de la lección actual (con numeración de líneas)
- [ ] Fondo oscuro permitido pero estética retro
- [ ] Tipografía monoespaciada
- [ ] NO en v1: editar código, ejecutar, compilación dinámica

---

## 11. Fase 9 — Refinamiento visual

> Solo después de tener la arquitectura funcionando.

- [ ] Ajustar bevels, sombras duras, bordes de 1px
- [ ] Ajustar tamaños/tipografía (tipografía pequeña)
- [ ] Mejorar menús, taskbar, iconos
- [ ] Ajustar animaciones (rápidas, 100–200ms)
- [ ] Limitar tamaños mínimos/máximos de ventanas
- [ ] Responsive:
  - [ ] Desktop ✓ (prioridad)
  - [ ] Laptop
  - [ ] Tablet (ventanas más grandes, drag limitado, taskbar utilizable, sin overflow horizontal)
- [ ] No intentar reproducir Win95 exacto en móviles

---

## 12. Estructura de carpetas objetivo

```
src/
├── components/
│   ├── desktop/  Desktop.tsx ✅, Taskbar.tsx ✅, StartMenu.tsx ✅, DesktopIcons.tsx ✅
│   ├── windows/  Window.tsx ✅, WindowTitleBar.tsx ✅, WindowControls.tsx ✅,
│   │             WindowManager.tsx ✅
│   ├── tutorial/ TutorialWindow.tsx ✅ (placeholder → Fase 5 real),
│   │             Lesson.tsx ⏳, LessonNavigation.tsx ⏳,
│   │             LessonExplanation.tsx ⏳, LessonCode.tsx ⏳, LessonResult.tsx ⏳
│   ├── code/     CodeEditorWindow.tsx ✅ (visor placeholder → Fase 8)
│   ├── stock/    StockWindow.tsx ✅ (tabla estática),
│   │             ProductTable.tsx ⏳, ProductRow.tsx ⏳, ProductForm.tsx ⏳,
│   │             StockSummary.tsx ⏳, StockAlerts.tsx ⏳  (Fase 6)
│   └── help/     HelpWindow.tsx ✅  (añadido fuera del spec)
├── context/      WindowContext.ts ✅, WindowProvider.tsx ✅,
│                 StockContext.ts ✅, StockProvider.tsx ✅
├── hooks/        useWindowManager.ts ✅
├── lessons/      01-jsx … 14-context-reducer.ts ⏳ (Fase 5)
├── data/         products.ts ✅, windows.ts ✅, lessons.ts ⏳
├── styles/       windows95.css ✅
├── App.tsx ✅
├── main.tsx ✅
└── index.css ✅  (@import "tailwindcss"; + windows95.css)
```

Checklist de creación:

- [x] `components/desktop/Desktop`
- [x] `components/desktop/Taskbar`
- [x] `components/desktop/StartMenu`
- [x] `components/desktop/DesktopIcons`
- [x] `components/windows/Window`
- [x] `components/windows/WindowTitleBar`
- [x] `components/windows/WindowControls`
- [x] `components/windows/WindowManager` (extra del spec: renderiza ventanas visibles con `AnimatePresence`)
- [x] `components/tutorial/TutorialWindow` (placeholder con lección 1 + botón `openWindow("stock")`)
- [ ] `components/tutorial/Lesson`
- [ ] `components/tutorial/LessonNavigation`
- [ ] `components/tutorial/LessonExplanation`
- [ ] `components/tutorial/LessonCode`
- [ ] `components/tutorial/LessonResult`
- [x] `components/code/CodeEditorWindow` (visor placeholder con menú y numeración)
- [x] `components/stock/StockWindow` (menú + tabla + statusbar; botón "Nuevo producto" disabled)
- [ ] `components/stock/ProductTable`
- [ ] `components/stock/ProductRow`
- [ ] `components/stock/ProductForm`
- [ ] `components/stock/StockSummary`
- [ ] `components/stock/StockAlerts`
- [x] `components/help/HelpWindow` (extra del spec)
- [x] `context/WindowContext`
- [x] `context/StockContext`
- [x] `context/WindowProvider`
- [x] `context/StockProvider`
- [x] `hooks/useWindowManager`
- [ ] `lessons/` (14 lecciones)
- [x] `data/products.ts`
- [x] `data/windows.ts` (extra: metadatos y posiciones/tamaños iniciales de ventanas)
- [ ] `data/lessons.ts`
- [x] `styles/windows95.css`
- [x] `App.tsx` solo monta providers + Desktop

---

## 13. Arquitectura final esperada

```
                       App
                        │
            ┌───────────┴───────────┐
            │                       │
     WindowProvider           StockProvider
            │                       │
      Window Manager           Stock State
            │                       │
    ┌───────┼────────┐       ┌──────┼──────┐
    ▼       ▼        ▼       ▼      ▼      ▼
 Tutorial  Code    Stock   Table   Form  Summary
```

- [ ] Dos Contexts: `WindowProvider` y `StockProvider`
- [ ] `App.jsx` no contiene lógica, solo montaje
- [ ] Sin abstracciones innecesarias (`ComponentFactoryManager`, `UniversalWindowController`, etc. — prohibido)
- [ ] Código: simple, explícito, legible, fácil de enseñar

---

## 14. Reglas visuales (recordatorio permanente)

**Sí:** bordes cuadrados · `border-radius: 0` · bordes 1px · bevels · sombras duras · botones 3D (outset/inset) · inputs hundidos · ventanas rectangulares · barras de título · menús · taskbar · escritorio `#008080` · tipografía pequeña

**No:** border-radius grande · glassmorphism · blur · sombras modernas · gradiente moderno · cards redondeadas · pills · UI SaaS · animaciones exageradas

**Animar con Motion solo:** abrir/cerrar ventanas, minimizar, maximizar, drag, efectos de menú.
**Con CSS:** estados de botones (`.win95-button:active { border-style: inset; }`), inputs, hover normales.

---

## 15. Fuera del alcance de la v1

❌ Backend · ❌ Base de datos · ❌ Login · ❌ API · ❌ Autenticación · ❌ Editor de código real · ❌ Compilación dinámica · ❌ React Router · ❌ Persistencia compleja (localStorage = evolución posterior) · ❌ Custom Hooks como lección obligatoria (opcional futura: lección 15)

**v1 = React + Tutorial + Stock Manager + Window Manager + Context + useContext**

---

## 16. Definición de terminado

- [ ] El escritorio Windows 95 funciona
- [ ] Las ventanas pueden abrirse
- [ ] Las ventanas pueden cerrarse
- [ ] Las ventanas pueden minimizarse
- [ ] Las ventanas pueden maximizarse
- [ ] Las ventanas pueden restaurarse
- [ ] Las ventanas pueden moverse
- [ ] Existe Taskbar
- [ ] Existe menú Inicio
- [ ] Existe Tutorial
- [ ] Existen las 14 lecciones
- [ ] Existe Code Editor
- [ ] Existe Stock Manager
- [ ] Stock Manager usa componentes
- [ ] Stock Manager usa props
- [ ] Stock Manager usa useState
- [ ] Stock Manager usa eventos
- [ ] Stock Manager usa listas
- [ ] Stock Manager usa formularios
- [ ] Stock Manager utiliza useEffect
- [ ] Se demuestra Prop Drilling
- [ ] Existe StockContext
- [ ] Se utiliza useContext
- [ ] Existe WindowContext
- [ ] Window Manager utiliza Context
- [ ] Existe useReducer
- [ ] Existe Context + useReducer
- [ ] Cada lección explica el concepto general
- [ ] Cada lección explica su aplicación al Stock Manager
- [ ] Cada lección tiene un resultado visible
- [ ] El usuario puede avanzar y retroceder
- [ ] Se muestra el progreso
- [ ] El código está separado por responsabilidades
- [ ] No existen abstracciones innecesarias
- [ ] `pnpm build` sin errores
- [ ] `pnpm lint` sin errores

---

## 17. Reglas de diseño (filtro para cada nueva feature)

1. ¿Ayuda a aprender React?
2. ¿Tiene una demostración visible?
3. ¿Mantiene la estética Windows 95?

Si la respuesta es **no** a las tres → probablemente no hace falta en la v1.

---

## 18. Log de sesiones

> Añadir una entrada por sesión: fecha, qué se hizo, qué quedó pendiente.

### 2026-09-24 — Creación del plan

- Creado `PROGRESS.md` con el plan completo.
- Verificado estado actual: proyecto Vite+React+TS existente, **sin Tailwind ni Motion**, `App.tsx` roto (imports inexistentes: `WindowManagerProvider`, `Desktop`, `react-router-dom`), `StockContext.tsx` vacío, borradores previos en `components/` y `context/`.
- Pendiente inmediato: decidir **TS vs JS** (sección 2) y ejecutar Fase 1.

### 2026-09-24 — Corrección de errores + Fases 1–4

**Errores corregidos:**
- `pnpm build` fallaba con ~34 errores TS en `src/components/desktop/Taskbar.ts` (JSX dentro de un `.ts`) → archivo borrado junto con todo el borrador legacy.
- `pnpm lint` fallaba con 3 errores: parseo de `Taskbar.ts`, `setProducts` sin usar en `StockWindow.tsx`, y `react-refresh/only-export-components` en `WindowContext.tsx` → resuelto separando contexto/provider/hook en 3 archivos.
- `App.tsx` era un entrypoint duplicado con 3 imports inexistentes → reescrito como root component.

**Trabajo realizado:**
- `pnpm add tailwindcss @tailwindcss/vite motion` (Tailwind 4.3.3, Motion 13.4.2).
- `vite.config.ts` con plugin de Tailwind; `index.css` con `@import "tailwindcss"`.
- `src/styles/windows95.css`: paleta Win95, bevels outset/inset de 2 capas, botones, inputs, ventana, titlebar, taskbar, menú Inicio con sidebar vertical, iconos de escritorio, `@layer components` (verificado en dist que Tailwind mantiene el orden de capas y genera utilidades).
- Contextos: `WindowContext.ts` + `WindowProvider.tsx` (estado de ventanas, `open/close/minimize/maximize/restore/focus/move`, zIndex con contador), `StockContext.ts` + `StockProvider.tsx` (products con `useState`), hook `useWindowManager.ts`.
- Escritorio: `Desktop`, `DesktopIcons` (clic selección / doble clic abre), `Taskbar` (Inicio, botones por ventana con pressed state, reloj con `setInterval`), `StartMenu` (backdrop para cerrar al hacer clic fuera).
- Ventanas: `Window` (drag solo desde titlebar con `useDragControls`, posición persistida en el Context, maximize con clase CSS + animación de `x/y` con Motion), `WindowTitleBar`, `WindowControls`, `WindowManager` (`AnimatePresence`).
- Contenido: `TutorialWindow` (placeholder lección 1 con botón `openWindow("stock")`), `CodeEditorWindow` (visor con numeración), `StockWindow` (tabla estática con estado OK/BAJO + resumen), `HelpWindow`.

**Verificación:**
- `pnpm build` ✓ (`tsc -b` + vite build, 441 módulos)
- `pnpm lint` ✓ (0 errores)
- Dev server en puerto 5199: `GET /`, `/src/main.tsx`, `/src/components/windows/Window.tsx` → 200 ✓
- **Pendiente: prueba visual manual** (`pnpm dev` y comprobar drag, minimize, maximize, menú Inicio, doble clic en iconos).

**Siguiente sesión:** Fase 5 — crear `src/data/lessons.ts` (o `src/lessons/`) con las 14 lecciones, componentes `Lesson*`, navegación, progreso y menú `Curso`.
