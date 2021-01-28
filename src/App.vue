<template>
    <BPMNDesigner :bpmnXML="pizzaDiagram" @save="save" :width="'90%'" :height="'1200px'">
        <template v-slot:palette>
            <DefaultPalette />
        </template>
    </BPMNDesigner>
</template>

<script>
    import BPMNDesigner from './components/bpmn/BPMNDesigner'
    import DefaultPalette from './components/bpmn/palette/DefaultPalette'
    import {pizzaDiagram} from '../stub/pizzaDiagram';

    export default {
        name: 'App',
        components: {
            BPMNDesigner,
            DefaultPalette
        },
        data: function () {
            return {pizzaDiagram: pizzaDiagram}
        },
        methods: {
            save:function(xml){
                console.log(xml)
            }
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
