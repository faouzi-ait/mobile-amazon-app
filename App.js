import Main from './src/Main';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { Provider } from 'react-redux';

import { BASE_API_URL, CURRENT_ENV } from '@env';

console.log(BASE_API_URL);
console.log(CURRENT_ENV);

const App = () => {
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Main />
        </PersistGate>
    </Provider>
  )
};

export default App;
