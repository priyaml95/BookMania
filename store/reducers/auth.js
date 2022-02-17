import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
    userId: '',
    token: ''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                userId: action.userId,
                token: action.token
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};  