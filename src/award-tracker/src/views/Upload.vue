<template>
  <div>
    <h3>Upload</h3>
    <form @submit="submit">
      <div>
        <input type="file" name="file" id="file" accept=".csv" @change="selected" />
        <label for="file">{{uploadText}}</label>

        <div v-if="inserted">{{inserted}} samples inserted</div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Upload",
  data: () => ({
    uploadText: "Choose a CSV",
    inserted: ""
  }),
  methods: {
    async selected(e) {
      var file = e.target.files[0];
      this.uploadText = file.name;

      let response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "text/csv"
        },
        body: file
      });

      let result = await response.json();

      this.inserted = result.inserted;
    },
    submit(e) {
      e.preventDefault();
    }
  }
};
</script>

<style>
[type="file"] {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
}

[type="file"] + label {
  background-color: #fff;
  border-radius: 4rem;
  color: #000;
  cursor: pointer;
  display: inline-block;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  height: 4rem;
  line-height: 4rem;
  padding-left: 2rem;
  padding-right: 2rem;
  transition: background-color 0.3s;
  border: 2px #f15d22 solid;
}

[type="file"]:focus + label,
[type="file"] + label:hover {
  background-color: #ff9c75;
}

[type="file"]:focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

[type="file"] + label * {
  pointer-events: none;
}
</style>