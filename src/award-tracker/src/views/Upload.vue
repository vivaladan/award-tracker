<template>
  <div>
    <h3>Upload</h3>
    <form @submit="submit">
      <div>
        <input
          type="file"
          name="file"
          id="file"
          accept=".csv"
          @change="selected"
          :disabled="submitting"
        />
        <label for="file" :disabled="submitting">{{uploadText}}</label>
        <div v-if="submitting" class="loader"></div>
        <div v-if="error">{{error}}</div>
        <div v-if="inserted">{{inserted}} samples inserted</div>
        <div v-if="errored">{{errored}} samples errored</div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Upload",
  data: () => ({
    uploadText: "Choose a CSV",
    inserted: "",
    errors: "",
    errored: "",
    submitting: false
  }),
  methods: {
    async selected(e) {
      var file = e.target.files[0];
      this.uploadText = file.name;
      this.error = "";
      this.inserted = "";
      this.errored = "";
      this.errors = "";
      this.submitting = true;

      try {
        let response = await fetch(`/api/upload?file=${file.name}`, {
          method: "POST",
          headers: {
            "Content-Type": "text/csv"
          },
          body: file
        });

        if (response.ok) {
          let result = await response.json();
          this.inserted = result.inserted;
          this.errored = result.errored;
          this.errors = result.errors;
        } else {
          this.error = (await response.text()) ?? "Something went wrong";
        }
      } catch (error) {
        this.error = error;
      }

      this.submitting = false;
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
  border: 2px #0387df solid;
}

[type="file"]:focus + label,
[type="file"] + label:hover {
  background-color: #3498db;
}

[type="file"]:focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

[type="file"] + label * {
  pointer-events: none;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>