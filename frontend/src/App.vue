<template>
    <div>
        <GlobalLoader />

        <HeaderBar />
        
        <div class="container mt-4">
            <GlobalAlert />
            <router-view />
        </div>

    </div>
</template>

<script>
import HeaderBar from "@/components/bars/header-bar.vue";
import GlobalAlert from "@/components/alerts/global-alert.vue";

export default {

    name: 'AppView',

    components: { HeaderBar, GlobalAlert }
}
</script>
