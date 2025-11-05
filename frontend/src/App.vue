<template>
    <div>        
        <AlertList />
        <router-view />
    </div>
</template>

<script>
import AlertList from './components/alerts/alert-list.vue'

export default {

    name: 'AppView',

    components: { AlertList }
}
</script>
