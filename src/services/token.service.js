export const sessionKey = 'session';

export const getAccessToken = () => {
    try {
        const session = localStorage.getItem(sessionKey);
        if (session === null) {
            return null;
        }
        return JSON.parse(session).accessToken;
    } catch (error) {
        console.error('Invalid Token. Redirecting to /login');
        return null;
    }
};

export const getRefreshToken = () => {
    try {
        const session = localStorage.getItem(sessionKey);
        if (session === null) {
            return null;
        }
        return JSON.parse(session).getRefreshToken;
    } catch (error) {
        console.error('Invalid Token. Redirecting to /login');
        return null;
    }
};

export const setSession = (newSession) => {
    localStorage.setItem(sessionKey, JSON.stringify(newSession));
};

export const getSession = () => {
    const session = localStorage.getItem(sessionKey);
    if (session) {
        return JSON.parse(session);
    }
    return null;
};

export const deleteItem = (key) => {
    localStorage.removeItem(key);
};


