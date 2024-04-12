import { createContext } from 'react';

const UserContext = createContext({
currentUser: null,
setUser: () => {}
});

export default UserContext;