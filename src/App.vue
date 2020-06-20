<template>
  <div id="app">
    <nav class="navbar has-shadow is-spaced" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a href class="navbar-item">
          <img
            src="./assets/corsair-logo.svg"
            alt="Bulma: a modern CSS framework based on Flexbox"
            width="112"
            height="28"
          />
        </a>
        <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu is-active">
        <div class="navbar-start">
          <a class="navbar-item">
            <router-link to="/">Home</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/about">About</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/upload">Upload</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/parts">Parts</router-link>
          </a>
        </div>

        <div class="navbar-end">
          <!-- navbar items -->
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
}
</style>
