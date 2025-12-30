export default {
    namespaced: true,

    state: {
        user: {},
        users: []
    },

    mutations: {
        setUsers(state, users) {
            state.users = users;
        },

        setUser(state, user) {
            state.user = user;
        },

        addUser(state, user) {
            if (!user || !user.id) return;
            const index = state.users.findIndex(u => u.id === user.id);
            if (index !== -1) state.users.splice(index, 1, user);
            else state.users.push(user);
        },
    }
};
