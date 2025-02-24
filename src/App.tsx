import { Referee } from './components/Referee/Referee';
import './App.css';

function App() {
  const jogandoContraIA = true

  return (
    <div className="app">
      <Referee jogandoContraIA={jogandoContraIA}/>
    </div>
  );
}

export default App