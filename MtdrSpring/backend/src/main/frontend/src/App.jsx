/*
Ultima modificacion Pedro Sanchez
3/9/2025
*/

import Board from "./components/Board";
import "./styles/index.css"

function App() {
  const hola = "Esta es nuestra APP"
  

  return(
  <>

    <h1>{hola}</h1>
    <div className="container">
      <Board/>
    </div>

  </>
  )
}
export default App;
