
export default {

    namespaced: true,

    state: {
        relationship: {},
        relationships: []
    },

    mutations: {

        setRelationships(state, relationships) {
            state.relationships = relationships;
        },

        setRelationship(state, relationship) {
            state.relationship = relationship;
        },

        addRelationship(state, relationship) {
            if (!relationship || !relationship.id) return;
            const index = state.relationships.findIndex(a => a.id === relationship.id);
            if (index !== -1) state.relationships.splice(index, 1, relationship);
            else state.relationships.push(relationship);
        },
    }
}
