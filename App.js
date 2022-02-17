import AppNavigator from './navigation/AppNavigator';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import userInfoReducer from './store/reducers/userInfo';
import { StatusBar } from 'react-native';

const rootReducer = combineReducers({
  auth: authReducer,
  userInfo: userInfoReducer
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar
        backgroundColor="#bf7547"
        barStyle="light-content"
      />
      <AppNavigator />
    </Provider>
  );
}
