export const increment = (nr) => {
    return {
        type: 'INCREMENT',
        payload: nr // add number to return
    };
};

export const decrement = () => {
    return {
        type: 'DECREMENT'
    };
};

export const loggedIn = () => {
    return {
        type: 'SIGN_IN'
    };
};