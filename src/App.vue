<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
body {
  margin: 0;
}

h1, h2, h3, p {
  margin: 0;
}

a {
  text-decoration: none;

  &:visited {
    color: inherit;
  }
}

button,
input {
  --webkit-appearance: none;
  border: none;
  background: none;;
  box-shadow: none;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
}

button {
  cursor: pointer;
}

ul,
ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
