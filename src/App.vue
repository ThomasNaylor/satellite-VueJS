<template>
  <div id="app">
    <Satellite />
  </div>
</template>

<script>
import Satellite from './components/Satellite.vue'

export default {
  name: 'app',
  components: {
    Satellite
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
</style>
