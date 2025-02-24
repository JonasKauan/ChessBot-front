import { Referee } from './components/Referee/Referee';
import './App.css';

function App() {
  const jogandoContraIA = false;

  return (
    <div className="app">
      <Referee jogandoContraIA={jogandoContraIA}/>
    </div>
  );
}

export default App