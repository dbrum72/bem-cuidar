<template>
    <div id="message" :class="typeClass" role="alert">
        {{ alert.message }}
    </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {

    name: 'AlertMessage',

    props: ['alert'],

    data() {
        return {
            timeout: null
        }
    },

    methods: {

        ...mapMutations('alerts', ['filterAlert']),
    },

    computed: {
        typeClass() {
            return this.alert.type
        }
    },

    created() {
        this.timeout = setTimeout(() => {
            this.filterAlert(this.alert)
        }, 4000)
    },

    beforeUnmount() {
        clearTimeout(this.timeout)
    }
}  
</script>

<style scoped>

.error {
    color: #ff0000;
    border-color: #F86969;
}

.info {
    color: #ff4500;
    border-color: #f5f570;
}

.success {
    color: #1d8803;
    border-color: #86FDAE;
}

#message {
    position: relative;
    right: -300px;    
    width: 300px;
    padding: .3rem 1rem;
    border-style: solid;
    border-width: 1px 1px 1px 7px;
    border-radius: 5px;
    background-color: #fff;
    animation: slideIn 0.5s forwards, slideOut 0.5s forwards 3s;    
}

@keyframes slideIn {    
    from {
        right: -300px;
    }

    to {
        right: 20px;
    }
}

@keyframes slideOut {
    from {
        right: 20px;
    }

    to {
        right: -300px;
    }
}
</style>
