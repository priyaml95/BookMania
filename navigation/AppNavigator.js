import { createAppContainer, createSwitchNavigator } from "react-navigation";
import AuthNavigator from './AuthNavigator';
import BooksNavigator from "./BooksNavigator";

const AppNavigator = createSwitchNavigator({
    Auth: AuthNavigator,
    Books: BooksNavigator
});

export default createAppContainer(AppNavigator);