export default {
  namespaced: true,

  state: {
    invites: [],
    invite: {}
  },

  mutations: {
    
    setInvites(state, invites) {
      state.invites = invites || []
    },

    
    setInvite(state, invite) {
      state.invite = invite || {}
    },

    addInvite(state, invite) {
      if (!invite || !invite.id) return

      const index = state.invites.findIndex(i => i.id === invite.id)

      if (index !== -1) {
        state.invites.splice(index, 1, invite)
      } else {
        state.invites.unshift(invite)
      }
    }
  }
}
