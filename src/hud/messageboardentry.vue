<template>
    <li class="messageboard-entry" v-html="message"></li>
</template>

<script>
    import Vue from 'vue';
    /**
     * @exports
     * A single entry in the message board's list of messages
     * @param {string} message
     * @extends {Vue.Component}
     */
    export default Vue.component('messageboard-entry', {
        props: ['message'],
    });
</script>

<style>
    .messageboard-entry .actor,
    .messageboard-entry .enemy {
        font-weight: bold;
    }

    .messageboard-entry .actor {
        color: #35c4ba;
    }

    .messageboard-entry .enemy {
        color: #c22b2b;
    }
</style>
