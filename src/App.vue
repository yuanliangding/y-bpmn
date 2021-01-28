<template>
    <BPMNDesigner :bpmnXML="pizzaDiagram" @save="save" :width="'90%'" :height="'1200px'"/>
</template>

<script>
    import BPMNDesigner from './components/bpmn/BPMNDesigner'
    import {pizzaDiagram} from '../stub/pizzaDiagram';

    export default {
        name: 'App',
        components: {
            BPMNDesigner
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
