import type { WindowId } from "../context/WindowContext";

export type LessonCategory =
  | "Fundamentos"
  | "Estado"
  | "Estado compartido"
  | "Arquitectura";

export interface LessonResult {
  window: WindowId;
  action: string;
  description: string;
  note?: string;
}

export interface LessonData {
  id: string;
  title: string;
  category: LessonCategory;
  concept: string;
  problem: string;
  syntax: string;
  example: string;
  application: string;
  result: LessonResult;
  codeFile: string;
  code: string;
}

export const lessons: LessonData[] = [
  {
    id: "jsx",
    title: "JSX y TSX",
    category: "Fundamentos",
    concept:
      "JSX es una extensión de sintaxis que permite escribir estructuras parecidas a HTML dentro de JavaScript. React transforma cada elemento JSX en una llamada a función que crea un elemento de la interfaz. Este proyecto usa TSX: JSX dentro de archivos TypeScript (.tsx), así que cada ejemplo puede llevar anotaciones de tipos.",
    problem:
      "Sin JSX, describir una interfaz obligaría a construir árboles de objetos o llamadas anidadas a funciones. El código se vuelve difícil de leer y difícil de comparar con lo que verá el usuario.",
    syntax: `const etiqueta = <h1>Hola</h1>;
const dinamico = <p>Stock: {stock}</p>;
// Las llaves {} abren una expresión JavaScript
// TSX = JSX + TypeScript: vive en archivos .tsx`,
    example: `// archivo: Product.tsx
function Product() {
  return (
    <div>
      <h2>Teclado</h2>
      <p>Stock: 10</p>
    </div>
  );
}`,
    application:
      "Cada fila del Stock Manager (Teclado, Mouse, Monitor) nace de JSX escrito en archivos .tsx. La tabla, los botones y la barra de estado son elementos JSX renderizados por React.",
    result: {
      window: "stock",
      action: "Ver en Stock Manager",
      description:
        "Abre el Stock Manager y observa la fila Teclado | 10. Ese HTML fue escrito con JSX en un archivo .tsx.",
      note: "Las llaves {} del JSX permiten insertar valores: {product.name} se convierte en el texto que ves en la tabla.",
    },
    codeFile: "src/components/stock/ProductRow.tsx",
    code: `interface ProductRowProps {
  product: Product;
}

function ProductRow({ product }: ProductRowProps) {
  return (
    <tr>
      <td>{String(product.id).padStart(2, "0")}</td>
      <td>{product.name}</td>
      <td>{product.stock}</td>
    </tr>
  );
}`,
  },
  {
    id: "components",
    title: "Componentes",
    category: "Fundamentos",
    concept:
      "Un componente es una función que devuelve JSX y representa una pieza reutilizable de la interfaz. Se usa como una etiqueta: <NombreComponente />. En este proyecto las funciones viven en archivos .tsx y pueden llevar tipos de TypeScript.",
    problem:
      "Sin componentes, la interfaz se escribe en un único bloque gigante. Duplicar filas, tablas o formularios a mano es propenso a errores y casi imposible de mantener.",
    syntax: `function Saludo() {
  return <p>Hola</p>;
}

// Uso (en cualquier archivo .tsx):
<Saludo />`,
    example: `// archivo: ProductRow.tsx
export default function ProductRow() {
  return (
    <tr>
      <td>Teclado</td>
      <td>10</td>
    </tr>
  );
}`,
    application:
      "El Stock Manager está dividido: StockWindow (ventana), ProductTable (tabla), ProductRow (fila), ProductForm (formulario), StockSummary (resumen) y StockAlerts (alertas).",
    result: {
      window: "stock",
      action: "Ver en Stock Manager",
      description:
        "La tabla, el resumen y las alertas se ven como una sola aplicación, pero cada zona es un componente distinto.",
      note: "Que algo sea componente no lo mejora automáticamente: se divide para organizar y reutilizar, no por costumbre.",
    },
    codeFile: "src/components/stock/ProductRow.tsx",
    code: `interface ProductRowProps {
  product: Product;
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function ProductRow({
  product,
  selected,
  onSelect,
}: ProductRowProps) {
  return (
    <tr onClick={() => onSelect(product.id)}>
      <td>{product.name}</td>
      <td>{product.stock}</td>
    </tr>
  );
}`,
  },
  {
    id: "props",
    title: "Props",
    category: "Fundamentos",
    concept:
      "Las props son la información que un componente padre le pasa a un componente hijo. Son el argumento de la etiqueta JSX y el hijo no las modifica: las recibe y las dibuja. Con TypeScript se declaran en una interface que el componente exige.",
    problem:
      "Un componente sin props queda escrito a mano para un dato concreto: mostraría siempre 'Teclado' y habría que copiarlo para Mouse y Monitor.",
    syntax: `<ProductRow product={product} />

interface ProductRowProps {
  product: Product;
}

function ProductRow({ product }: ProductRowProps) {
  return <td>{product.name}</td>;
}`,
    example: `// Padre
<ProductRow product={{ name: "Mouse", stock: 5 }} />

// Hijo (archivo .tsx)
interface ProductRowProps {
  product: Product;
}

function ProductRow({ product }: ProductRowProps) {
  return <tr><td>{product.name}</td></tr>;
}`,
    application:
      "ProductTable recibe la lista de productos y hace: products.map((product) => <ProductRow product={product} />). El mismo componente dibuja las tres filas con datos distintos.",
    result: {
      window: "stock",
      action: "Ver en Stock Manager",
      description:
        "Las tres filas usan el mismo ProductRow. Cambian los datos que reciben por props, no el componente.",
      note: "Las props fluyen en una sola dirección: de padre a hijo. Un hijo nunca debe escribir las props que recibió.",
    },
    codeFile: "src/components/stock/ProductTable.tsx",
    code: `{products.map((product: Product) => (
  <ProductRow
    key={product.id}
    product={product}
    selected={product.id === selectedId}
    onSelect={handleSelect}
  />
))}`,
  },
  {
    id: "use-state",
    title: "useState",
    category: "Estado",
    concept:
      "useState permite que un componente recuerde información entre renders y la actualice. Devuelve el valor actual y una función para cambiarlo; al cambiarlo, React vuelve a renderizar el componente.",
    problem:
      "Las variables normales se reinician en cada render. Sin estado, la interfaz nunca cambiaría por sí misma: cada actualización se perdería en el siguiente render.",
    syntax: `const [stock, setStock] = useState<number>(10);

// stock     → valor actual (10)
// setStock  → función que actualiza el estado
// <number>  → tipo del estado (TypeScript)`,
    example: `function Contador() {
  const [stock, setStock] = useState<number>(10);

  return (
    <button onClick={() => setStock(stock + 1)}>
      Stock: {stock}
    </button>
  );
}`,
    application:
      "Cada fila del Stock Manager tiene botones [+] y [-] que modifican el stock del producto. Los datos viven en StockContext (ahora con useReducer) y cada cambio repinta la tabla.",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Pulsa [+] en una fila: el stock pasa de 10 a 11. Pulsa [-]: vuelve a 10.",
      note: "El componente se volvió a renderizar porque el estado cambió con setStock (o con dispatch, su versión organizada).",
    },
    codeFile: "src/components/stock/ProductRow.tsx",
    code: `// Versión de la etapa: estado local con useState
const [stock, setStock] = useState<number>(product.stock);

<button onClick={() => setStock(stock + 1)}>+</button>
<button onClick={() => setStock(stock - 1)}>-</button>

// Versión final del proyecto: el estado vive en StockContext
// y cambia con dispatch({ type: "UPDATE_STOCK", ... })
// Ver lección 13 — useReducer`,
  },
  {
    id: "events",
    title: "Eventos",
    category: "Estado",
    concept:
      "React permite responder a las acciones del usuario con funciones en formato onNombre: onClick (clic), onChange (cambio en un input) y onSubmit (envío de formulario).",
    problem:
      "Sin eventos, la interfaz es decorativa: se puede mirar, pero no se puede usar. Nada responde a lo que hace la persona.",
    syntax: `<button onClick={handleAdd}>Agregar</button>
<input onChange={(event) => setName(event.target.value)} />
<form onSubmit={handleSubmit}>...</form>

// Tipado opcional (TSX):
// (event: ChangeEvent<HTMLInputElement>) => void`,
    example: `function Boton() {
  const [count, setCount] = useState<number>(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Pulsaciones: {count}
    </button>
  );
}`,
    application:
      "Los eventos mueven toda la aplicación: +/- de stock, selección de fila, doble clic en los iconos, botones de la taskbar, abrir y cerrar ventanas, y el formulario de productos.",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Pulsa [+], [-] y [✕] de una fila, y haz clic en una fila para seleccionarla. Cada acción es un evento.",
      note: "El Window Manager también son eventos: onClick en los controles de la ventana y onDoubleClick en los iconos del escritorio.",
    },
    codeFile: "src/components/stock/ProductRow.tsx",
    code: `<button onClick={() => onAddStock(product.id)}>+</button>
<button onClick={() => onRemoveStock(product.id)}>-</button>
<button onClick={() => onRemove(product.id)}>X</button>

<tr onClick={() => onSelect(product.id)}>...</tr>`,
  },
  {
    id: "lists",
    title: "Listas",
    category: "Estado",
    concept:
      "Los datos llegan como arrays y React los convierte en elementos con .map(). Cada elemento necesita una key única (normalmente el id) para que React identifique qué fila cambió.",
    problem:
      "Escribir cada fila a mano obliga a duplicar JSX por cada producto y no escala: añadir un producto obligaría a editar la tabla a mano.",
    syntax: `products.map((product: Product) => (
  <ProductRow
    key={product.id}
    product={product}
  />
))`,
    example: `const nombres = ["Teclado", "Mouse", "Monitor"];

nombres.map((nombre: string, i: number) => (
  <li key={i}>{nombre}</li>
))`,
    application:
      "ProductTable recorre products y genera una fila por producto. Cuando agregas un producto, el array crece y aparece una fila nueva sin tocar el JSX de la tabla.",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Agrega un producto con el formulario: aparece automáticamente una fila más en la tabla.",
      note: "Sin key, React no sabe qué fila cambió y puede repintar de más. Por eso ProductRow recibe key={product.id}.",
    },
    codeFile: "src/components/stock/ProductTable.tsx",
    code: `{products.map((product) => (
  <ProductRow
    key={product.id}
    product={product}
    selected={product.id === selectedId}
    onSelect={handleSelect}
  />
))}`,
  },
  {
    id: "forms",
    title: "Formularios",
    category: "Estado",
    concept:
      "Los inputs controlados son inputs cuyo valor viene del estado: value apunta al estado y onChange lo actualiza. El formulario se maneja con onSubmit y e.preventDefault().",
    problem:
      "Sin estado en el formulario, los valores viven en el DOM: no se pueden validar, comparar ni enviar junto al resto de la aplicación.",
    syntax: `<form onSubmit={handleSubmit}>
  <input
    value={name}
    onChange={(event) => setName(event.target.value)}
  />
  <button type="submit">Agregar</button>
</form>

// Tipado del envío (TSX):
const handleSubmit = (event: FormEvent) => { ... }`,
    example: `function Form() {
  const [name, setName] = useState<string>("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}`,
    application:
      "ProductForm tiene dos campos controlados (nombre y stock). Al enviar, despacha ADD_PRODUCT, limpia los campos y la tabla muestra el producto nuevo.",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Pulsa [Nuevo producto], escribe 'Webcam' y stock '8', y envía. La fila Webcam | 8 aparece en la tabla.",
      note: "e.preventDefault() evita que la página se recargue al enviar el formulario.",
    },
    codeFile: "src/components/stock/ProductForm.tsx",
    code: `const [name, setName] = useState<string>("");
const [stock, setStock] = useState<string>("");

const handleSubmit = (event: FormEvent) => {
  event.preventDefault();
  dispatch({
    type: "ADD_PRODUCT",
    payload: { name, stock: Number(stock) },
  });
  setName("");
  setStock("");
};`,
  },
  {
    id: "use-effect",
    title: "useEffect",
    category: "Estado",
    concept:
      "useEffect ejecuta código después del render cuando cambian sus dependencias. Su propósito real es sincronizar el componente con sistemas externos: el título de la pestaña, localStorage, una API, un temporizador o un event listener.",
    problem:
      "Hay cosas que React no repinta: el título del documento no forma parte de la interfaz. Si nadie lo actualiza, queda desincronizado de los datos.",
    syntax: `useEffect(() => {
  // código después del render
  document.title = \`Productos: \${products.length}\`;
}, [products]); // ← dependencias`,
    example: `useEffect(() => {
  document.title = \`Productos: \${products.length}\`;
}, [products]);`,
    application:
      "El StockWindow actualiza el título de la pestaña cada vez que cambia la lista ('Productos: 3', luego 'Productos: 4'...), y al cerrarse restaura el título de la página. StockProvider hace la otra sincronización: guarda los productos en localStorage, así que cerrar y volver a abrir la aplicación conserva el stock.",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Agrega un producto y mira el título de la pestaña del navegador: cambia a 'Productos: 4'. Luego recarga la página: el stock se conserva (localStorage).",
      note: "No lo uses como 'ejecutar código cuando algo cambia' sin más. Es para sincronizar React con el exterior.",
    },
    codeFile: "src/components/stock/StockWindow.tsx",
    code: `useEffect(() => {
  document.title = \`Productos: \${state.products.length}\`;
}, [state.products]);`,
  },
  {
    id: "prop-drilling",
    title: "Prop Drilling",
    category: "Estado compartido",
    concept:
      "Prop drilling es pasar una prop a través de componentes intermedios que no la usan, solo para que llegue a uno que sí la necesita.",
    problem:
      "Si ProductRow necesita products, la información debe atravesar StockWindow → ProductTable → ProductRow. Cada nivel se acopla a datos que no le competen y el código se vuelve ruidoso.",
    syntax: `App
 │ lessonIndex
 ▼
WindowManager
 │ lessonIndex
 ▼
TutorialWindow / CodeEditorWindow
 │ lessonIndex
 ▼
Lección actual   ← la única que lo usa`,
    example: `// WindowManager no usa lessonIndex, pero debe pasarlo
interface WindowManagerProps {
  lessonIndex: number;
  onLessonChange: (index: number) => void;
}`,
    application:
      "En este proyecto el fenómeno se ve con la lección actual: Desktop guarda el índice de la lección y se lo pasa por props a WindowManager para que llegue a TutorialWindow, CodeEditorWindow y ExplorerWindow.",
    result: {
      window: "tutorial",
      action: "Ver la cadena de props",
      description:
        "La lección cambia desde el Explorador de lecciones o la ventana Tutorial, pero el dato recorre Desktop → WindowManager → cada ventana.",
      note: "Prop drilling no es un pecado: es válido cuando pocos componentes lo atraviesan. El problema aparece cuando muchos componentes no usan la información que transmiten.",
    },
    codeFile: "src/components/windows/WindowManager.tsx",
    code: `// Desktop (dueño del estado)
const [lessonIndex, setLessonIndex] = useState<number>(0);

<WindowManager
  lessonIndex={lessonIndex}
  onLessonChange={setLessonIndex}
/>

// WindowManager (componente intermedio que solo transmite)
<TutorialWindow
  lessonIndex={lessonIndex}
  onLessonChange={onLessonChange}
/>`,
  },
  {
    id: "context",
    title: "Context",
    category: "Estado compartido",
    concept:
      "Context permite compartir información con todos los componentes descendientes sin pasar props manualmente por cada nivel. Se crea con createContext y se entrega con un Provider.",
    problem:
      "Para evitar el prop drilling haría falta modificar cada nivel intermedio cada vez que cambia la información compartida.",
    syntax: `const StockContext = createContext<StockValue | null>(null);

function StockProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  return (
    <StockContext.Provider value={{ products }}>
      {children}
    </StockContext.Provider>
  );
}`,
    example: `const ThemeContext = createContext("claro");

function App() {
  return (
    <ThemeContext.Provider value="oscuro">
      <Pagina />
    </ThemeContext.Provider>
  );
}`,
    application:
      "WindowContext administra las ventanas de todo el escritorio y StockContext administra los productos. App los monta alrededor de Desktop.",
    result: {
      window: "stock",
      action: "Abrir Stock Manager con Context",
      description:
        "Este botón ejecuta openWindow('stock') desde el propio tutorial: el tutorial está recibiendo WindowContext, igual que el resto de la aplicación.",
      note: "El escritorio que estás usando ahora es un ejemplo real de Context: sin WindowContext, habría que pasar openWindow por props hasta cada ventana.",
    },
    codeFile: "src/context/WindowProvider.tsx",
    code: `// WindowContext.ts — el tipo del valor y el contexto
const WindowContext = createContext<WindowContextValue | null>(null);

// WindowProvider.tsx — el Provider entrega el valor
<WindowContext.Provider
  value={{
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
  }}
>
  {children}
</WindowContext.Provider>`,
  },
  {
    id: "use-context",
    title: "useContext",
    category: "Estado compartido",
    concept:
      "useContext permite consumir un Context desde cualquier componente. Devuelve el valor del Provider más cercano. Son tres piezas: createContext → Provider → useContext.",
    problem:
      "Sin useContext, un componente tendría que recibir el contexto por props, lo que volvería a crear el prop drilling.",
    syntax: `const { products } = useContext(StockContext);`,
    example: `const { openWindow } = useContext(WindowContext);

<button onClick={() => openWindow("stock")}>
  Abrir Stock Manager
</button>`,
    application:
      "ProductTable, ProductForm, StockSummary y StockAlerts consumen StockContext. Taskbar, StartMenu, Window y el tutorial consumen WindowContext con useWindowManager().",
    result: {
      window: "stock",
      action: "Ver en Stock Manager",
      description:
        "Tabla, resumen y alertas reaccionan al mismo estado: el producto que agregas en el formulario aparece en las tres partes a la vez.",
      note: "useContext no crea nada nuevo: lee el valor que el Provider puso en el árbol.",
    },
    codeFile: "src/components/stock/StockSummary.tsx",
    code: `import { useContext } from "react";
import { StockContext } from "../../context/StockContext";

export default function StockSummary() {
  const context = useContext(StockContext);
  if (context === null) {
    throw new Error("Fuera de <StockProvider>");
  }

  const { products } = context;
  const total = products.reduce((s, p) => s + p.stock, 0);

  return <span>Stock total: {total}</span>;
}`,
  },
  {
    id: "context-state",
    title: "Context + useState",
    category: "Estado compartido",
    concept:
      "El Provider no solo comparte datos: puede guardar el estado y exponer las funciones que lo modifican. Así el estado compartido vive en un único lugar y todos consumen la misma fuente.",
    problem:
      "Si cada ventana guardara su propia copia de los productos, se desincronizarían: el formulario agregaría a su lista y la tabla vería otra.",
    syntax: `function StockProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) =>
    setProducts((current) => [...current, product]);

  return (
    <StockContext.Provider
      value={{ products, addProduct }}
    >
      {children}
    </StockContext.Provider>
  );
}`,
    example: `const { products, addProduct } = useContext(StockContext);

addProduct({ id: 4, name: "Webcam", stock: 8 });`,
    application:
      "StockProvider es la fuente única de productos: agregar, eliminar o modificar desde cualquier ventana mantiene toda la aplicación consistente.",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Agrega un producto desde el formulario y observa cómo el resumen, las alertas y la cabecera de la tabla se actualizan juntos.",
      note: "Una sola fuente de verdad: si dos componentes guardan 'su' copia del estado, tarde o temprano discrepan.",
    },
    codeFile: "src/context/StockProvider.tsx",
    code: `// Evolución del Provider en este proyecto:
// 1. useState con products
// 2. useState + addProduct / removeProduct / updateStock
// 3. useReducer (lección 13)

const [state, dispatch] = useReducer(stockReducer, initialState);`,
  },
  {
    id: "use-reducer",
    title: "useReducer",
    category: "Arquitectura",
    concept:
      "useReducer centraliza las actualizaciones de un estado complejo en una función pura llamada reducer. Recibe el estado actual y una action, y devuelve el nuevo estado.",
    problem:
      "Cuando hay muchas operaciones (agregar, eliminar, modificar stock, seleccionar, vaciar), crecer el número de setters confusa el código y hace difícil predecir el resultado de cada acción.",
    syntax: `const [state, dispatch] = useReducer(reducer, initialState);

dispatch({
  type: "ADD_PRODUCT",
  payload: product
});`,
    example: `interface State {
  count: number;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}`,
    application:
      "stockReducer concentra ADD_PRODUCT, REMOVE_PRODUCT, UPDATE_STOCK, SELECT_PRODUCT y CLEAR_STOCK. El resto de la aplicación solo despacha acciones.",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Usa [+], [-], [✕] y [Vaciar]: cada acción es un dispatch({ type, payload }) que pasa por el reducer.",
      note: "Flujo: evento → dispatch → action → reducer → nuevo estado → render. El reducer nunca modifica el estado anterior: devuelve uno nuevo.",
    },
    codeFile: "src/context/StockProvider.tsx",
    code: `function stockReducer(state: StockState, action: StockAction) {
  switch (action.type) {
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, {
          id: state.nextId,
          name: action.payload.name,
          stock: action.payload.stock,
        }],
        nextId: state.nextId + 1,
      };

    case "UPDATE_STOCK":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? {
                ...product,
                stock: Math.max(0, product.stock + action.payload.delta),
              }
            : product
        ),
      };

    default:
      return state;
  }
}`,
  },
  {
    id: "context-reducer",
    title: "Context + useReducer",
    category: "Arquitectura",
    concept:
      "La combinación final: el Provider guarda el resultado de useReducer y expone { state, dispatch } a todo el árbol. Estado compartido y transiciones centralizadas en un solo lugar.",
    problem:
      "Con muchas ventanas y operaciones, el estado repartido y los setters dispersos producen inconsistencias y bugs difíciles de rastrear.",
    syntax: `function StockProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    stockReducer,
    initialState
  );

  return (
    <StockContext.Provider value={{ state, dispatch }}>
      {children}
    </StockContext.Provider>
  );
}`,
    example: `// Consumidor
const { state, dispatch } = useContext(StockContext);

dispatch({
  type: "REMOVE_PRODUCT",
  payload: productId
});`,
    application:
      "Esta es la arquitectura final: WindowProvider administra las ventanas del escritorio y StockProvider administra el inventario. App solo los monta.",
    result: {
      window: "stock",
      action: "Ver la arquitectura final",
      description:
        "Agrega, elimina y modifica productos: todo fluye por dispatch → stockReducer → StockContext → tabla, resumen y alertas.",
      note: "Context no reemplaza a las props: se usa cuando una información necesita ser compartida por distintas partes del árbol.",
    },
    codeFile: "src/App.tsx",
    code: `export default function App() {
  return (
    <WindowProvider>
      <StockProvider>
        <Desktop />
      </StockProvider>
    </WindowProvider>
  );
}`,
  },
];

export const lessonCategories: LessonCategory[] = [
  "Fundamentos",
  "Estado",
  "Estado compartido",
  "Arquitectura",
];

export interface LessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const lessonQuizzes: Record<string, LessonQuiz> = {
  jsx: {
    question: "¿Qué es TSX?",
    options: [
      "TypeScript + JSX: JSX dentro de archivos .tsx",
      "Una librería de estilos para React",
      "El compilador que convierte HTML en JavaScript",
    ],
    answer: 0,
    explanation:
      "TSX es JSX dentro de archivos TypeScript, así que puedes anotar tipos mientras escribes interfaz.",
  },
  components: {
    question: "¿Cuándo conviene dividir la interfaz en componentes?",
    options: [
      "Cuando ayuda a organizar y reutilizar la interfaz",
      "Siempre que un archivo pase de 10 líneas",
      "Nunca: los componentes complican el código",
    ],
    answer: 0,
    explanation:
      "Dividir no mejora nada por sí solo; se hace para organizar y reutilizar, no por costumbre.",
  },
  props: {
    question: "¿Hacia dónde fluyen las props?",
    options: [
      "De padre a hijo, en una sola dirección",
      "De hijo a padre",
      "En cualquier dirección, como el estado",
    ],
    answer: 0,
    explanation:
      "Las props las entrega el padre y el hijo solo las recibe y dibuja; nunca debe modificarlas.",
  },
  "use-state": {
    question: "Al llamar setStock(11), ¿qué ocurre?",
    options: [
      "React vuelve a renderizar el componente con el nuevo valor",
      "Se modifica el nodo del DOM directamente",
      "El componente se desmonta y se vuelve a montar",
    ],
    answer: 0,
    explanation:
      "Cambiar el estado provoca un nuevo render: React repinta lo que cambió.",
  },
  events: {
    question: "¿Cuál es la forma correcta de escribir un evento en React?",
    options: ["onClick (on + mayúscula)", "onclick", "clickOn"],
    answer: 0,
    explanation:
      "React usa on + nombre en camelCase: onClick, onChange, onSubmit.",
  },
  lists: {
    question: "¿Por qué cada fila de un .map() necesita una key?",
    options: [
      "Para que React identifique qué elemento cambió",
      "Para ordenar el array automáticamente",
      "Porque TypeScript lo exige",
    ],
    answer: 0,
    explanation:
      "Sin key, React no puede rastrear las filas y repinta de más.",
  },
  forms: {
    question: "¿Qué hace e.preventDefault() en el onSubmit?",
    options: [
      "Evita que la página se recargue al enviar el formulario",
      "Detiene la propagación del evento a otros componentes",
      "Limpia los campos del formulario",
    ],
    answer: 0,
    explanation:
      "El comportamiento por defecto del form es recargar la página; preventDefault lo cancela.",
  },
  "use-effect": {
    question: "¿Para qué sirve realmente useEffect?",
    options: [
      "Para sincronizar React con sistemas externos (título, localStorage, APIs...)",
      "Para ejecutar cualquier código cuando algo cambia",
      "Para modificar el estado de otros componentes",
    ],
    answer: 0,
    explanation:
      "useEffect sincroniza con el exterior; no es un 'ejecutar cuando quieras'.",
  },
  "prop-drilling": {
    question: "¿Cuándo se convierte el prop drilling en un problema?",
    options: [
      "Cuando muchos componentes transmiten datos que no usan",
      "Cuando la prop atraviesa dos niveles",
      "Nunca: siempre es preferible a Context",
    ],
    answer: 0,
    explanation:
      "Pocos niveles está bien; el ruido aparece cuando todos los intermedios pasan datos ajenos.",
  },
  context: {
    question: "¿Qué evita Context?",
    options: [
      "Pasar props manualmente por cada nivel del árbol",
      "Usar useState en los componentes",
      "Crear componentes pequeños",
    ],
    answer: 0,
    explanation:
      "El Provider entrega el valor a todos los descendientes sin cadena de props.",
  },
  "use-context": {
    question: "¿Qué devuelve useContext(Context)?",
    options: [
      "El valor del Provider más cercano",
      "Una función para actualizar el contexto",
      "El estado completo de la aplicación",
    ],
    answer: 0,
    explanation:
      "useContext lee (no escribe) el valor que el Provider puso en el árbol.",
  },
  "context-state": {
    question: "En Context + useState, ¿dónde vive el estado compartido?",
    options: [
      "En el Provider, que expone los datos y las funciones para cambiarlos",
      "En cada componente que consume el contexto",
      "En el DOM, dentro de los inputs",
    ],
    answer: 0,
    explanation:
      "Una sola fuente de verdad en el Provider evita copias que se desincronizan.",
  },
  "use-reducer": {
    question: "¿Qué hace un reducer?",
    options: [
      "Recibe el estado actual y una action, y devuelve el nuevo estado",
      "Modifica el estado anterior en el sitio",
      "Descarga datos de una API",
    ],
    answer: 0,
    explanation:
      "Es una función pura: nunca muta el estado, siempre devuelve uno nuevo.",
  },
  "context-reducer": {
    question: "En la arquitectura final de la app, ¿qué recibe cada consumidor?",
    options: [
      "{ state, dispatch } desde el Provider",
      "Una copia de los productos por props",
      "Un useState distinto por ventana",
    ],
    answer: 0,
    explanation:
      "Provider con useReducer + consumidores con useContext: estado y transiciones en un solo lugar.",
  },
};

export const lessonPath = (index: number): string =>
  index <= 0 ? "/" : `/leccion/${lessons[index]?.id ?? lessons[0].id}`;
