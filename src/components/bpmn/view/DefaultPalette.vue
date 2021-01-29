<template>
    <div>
        <div v-for="entry in entries" v-bind:key="entry" >
            {{entry}}
        </div>
    </div>
</template>

<script>
    import {inject} from  'vue';

    export default {
        name: "DefaultPalette",
        props: {

        },
        setup() {
            const entries = inject('entries')
            return {entries}
        }
    }
</script>

<style scoped>

</style>
