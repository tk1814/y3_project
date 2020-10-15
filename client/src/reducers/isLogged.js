const loggedReducer = (state = false, action) => {
    switch(action.type) {
        case 'SIGN_IN':
            state=true;
            return state; // !state
        default:
            return state;
    }
};

export default loggedReducer;