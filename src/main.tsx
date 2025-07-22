import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store, persistor } from './store/store.ts'
import { Provider } from "react-redux";
import { SnackbarProvider } from 'notistack'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <SnackbarProvider
          maxSnack={2}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <App />
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  // </StrictMode>
)
