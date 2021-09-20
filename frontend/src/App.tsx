import { Dispatch, SetStateAction, useState, createContext, Context } from 'react';
import './App.css';
import Main from './components/Main';
import { GlobalState } from './interfaces/interfaces';
import { RecoilRoot } from 'recoil';

const dummy_func = (token: GlobalState) => { };
const dummy_state: GlobalState = { isLoggedIn: false }
const GlobalContext: Context<[GlobalState, (state: GlobalState) => void]> = createContext([dummy_state, dummy_func]);

function App() {
  // State Declaration
  const state: [GlobalState, Dispatch<SetStateAction<GlobalState>>] = useState(dummy_state);
  return (
    <div className="App">
      <RecoilRoot>
        <GlobalContext.Provider value={state}>
          <Main />
        </GlobalContext.Provider>
      </RecoilRoot>
    </div >
  );
}

export default App;
export { GlobalContext };
