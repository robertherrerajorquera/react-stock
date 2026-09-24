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
    title: "JSX",
    category: "Fundamentos",
    concept:
      "JSX es una extensión de sintaxis que permite escribir estructuras parecidas a HTML dentro de JavaScript. React transforma cada elemento JSX en una llamada a función que crea un elemento de la interfaz.",
    problem:
      "Sin JSX, describir una interfaz obligaría a construir árboles de objetos o llamadas anidadas a funciones. El código se vuelve difícil de leer y difícil de comparar con lo que verá el usuario.",
    syntax: `const etiqueta = <h1>Hola</h1>;
const dinamico = <p>Stock: {stock}</p>;
// Las llaves {} abren una expresión JavaScript`,
    example: `function Product() {
  return (
    <div>
      <h2>Teclado</h2>
      <p>Stock: 10</p>
    </div>
  );
}`,
    application:
      "Cada fila del Stock Manager (Teclado, Mouse, Monitor) nace de JSX. La tabla, los botones y la barra de estado son elementos JSX renderizados por React.",
    result: {
      window: "stock",
      action: "Ver en Stock Manager",
      description:
        "Abre el Stock Manager y observa la fila Teclado | 10. Ese HTML fue escrito con JSX.",
      note: "Las llaves {} del JSX permiten insertar valores: {product.name} se convierte en el texto que ves en la tabla.",
    },
    codeFile: "src/components/stock/ProductRow.tsx",
    code: `function ProductRow({ product }) {
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
      "Un componente es una función de JavaScript que devuelve JSX y representa una pieza reutilizable de la interfaz. Se usa como una etiqueta: <NombreComponente />.",
    problem:
      "Sin componentes, la interfaz se escribe en un único bloque gigante. Duplicar filas, tablas o formularios a mano es propenso a errores y casi imposible de mantener.",
    syntax: `function Saludo() {
  return <p>Hola</p>;
}

// Uso:
<Saludo />`,
    example: `function ProductRow() {
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
    code: `export default function ProductRow({ product, selected, onSelect }) {
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
      "Las props son la información que un componente padre le pasa a un componente hijo. Son el argumento de la etiqueta JSX y el hijo no las modifica: las recibe y las dibuja.",
    problem:
      "Un componente sin props queda escrito a mano para un dato concreto: mostraría siempre 'Teclado' y habría que copiarlo para Mouse y Monitor.",
    syntax: `<ProductRow product={product} />

function ProductRow({ product }) {
  return <td>{product.name}</td>;
}`,
    example: `// Padre
<ProductRow product={{ name: "Mouse", stock: 5 }} />

// Hijo
function ProductRow({ product }) {
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
    id: "use-state",
    title: "useState",
    category: "Estado",
    concept:
      "useState permite que un componente recuerde información entre renders y la actualice. Devuelve el valor actual y una función para cambiarlo; al cambiarlo, React vuelve a renderizar el componente.",
    problem:
      "Las variables normales se reinician en cada render. Sin estado, la interfaz nunca cambiaría por sí misma: cada actualización se perdería en el siguiente render.",
    syntax: `const [stock, setStock] = useState(10);

// stock     → valor actual (10)
// setStock  → función que actualiza el estado`,
    example: `function Contador() {
  const [stock, setStock] = useState(10);

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
const [stock, setStock] = useState(product.stock);

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
<input onChange={(e) => setName(e.target.value)} />
<form onSubmit={handleSubmit}>...</form>`,
    example: `function Boton() {
  const [count, setCount] = useState(0);

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
    syntax: `products.map((product) => (
  <ProductRow
    key={product.id}
    product={product}
  />
))`,
    example: `const nombres = ["Teclado", "Mouse", "Monitor"];

nombres.map((nombre, i) => (
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
    onChange={(e) => setName(e.target.value)}
  />
  <button type="submit">Agregar</button>
</form>`,
    example: `function Form() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
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
    code: `const [name, setName] = useState("");
const [stock, setStock] = useState("");

const handleSubmit = (event) => {
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
      "StockProvider actualiza el título de la pestaña cada vez que cambia la lista de productos: 'Productos: 3', luego 'Productos: 4'...",
    result: {
      window: "stock",
      action: "Probar en Stock Manager",
      description:
        "Agrega un producto y mira el título de la pestaña del navegador: cambia a 'Productos: 4'.",
      note: "No lo uses como 'ejecutar código cuando algo cambia' sin más. Es para sincronizar React con el exterior.",
    },
    codeFile: "src/context/StockProvider.tsx",
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
 │ products
 ▼
StockPage
 │ products
 ▼
ProductTable
 │ products
 ▼
ProductRow   ← la única que lo usa`,
    example: `// StockPage no usa products, pero debe pasarlo
function StockPage({ products }) {
  return <ProductTable products={products} />;
}`,
    application:
      "En este proyecto el fenómeno se ve con la lección actual: Desktop guarda el índice de la lección y se lo pasa por props a WindowManager para que llegue a TutorialWindow y CodeEditorWindow.",
    result: {
      window: "tutorial",
      action: "Ver la cadena de props",
      description:
        "La lección cambia desde el menú Curso o desde la ventana Tutorial, pero el dato recorre Desktop → WindowManager → TutorialWindow.",
      note: "Prop drilling no es un pecado: es válido cuando pocos componentes lo atraviesan. El problema aparece cuando muchos componentes no usan la información que transmiten.",
    },
    codeFile: "src/components/windows/WindowManager.tsx",
    code: `// Desktop (dueño del estado)
const [lessonIndex, setLessonIndex] = useState(0);

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
    syntax: `const StockContext = createContext();

function StockProvider({ children }) {
  const [products, setProducts] = useState([]);
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
    codeFile: "src/context/WindowContext.ts",
    code: `const WindowContext = createContext<WindowContextValue | null>(null);

// En WindowProvider
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
    syntax: `function StockProvider({ children }) {
  const [products, setProducts] = useState([]);

  const addProduct = (product) =>
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
    example: `function reducer(state, action) {
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
    syntax: `function StockProvider({ children }) {
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
    code: `function App() {
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
