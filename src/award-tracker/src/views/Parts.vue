<template>
  <div class="section">
    <h1 class="title">Products</h1>
    <h2 class="subtitle">Search for the product that you are interested in</h2>
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <form @submit="submit">
            <div class="field is-horizontal">
              <div class="field-label">
                <label for="partNumber" class="label">Part Number</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      type="text"
                      name="partNumber"
                      id="partNumber"
                      placeholder="Part Number"
                      v-model="partNumber"
                      class="input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label">
                <label for="partName" class="label">Part Name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      type="text"
                      name="partName"
                      id="partName"
                      placeholder="Part Name"
                      class="input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label">
                <label for="region" class="label">Region</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input type="text" name="region" id="region" placeholder="Region" class="input" />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label">
                <label for="country" class="label">Country</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      placeholder="Country"
                      class="input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label">
                <label for="year" class="label">Year</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input type="text" name="year" id="year" placeholder="year" class="input" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                name="submit"
                id="submit"
                class="button is-info"
                :class="{ 'is-loading': loading }"
              >Search</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="container">
      <table class="table is-fullwidth is-bordered is-striped" v-if="parts.length">
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Part Name</th>
            <th>Category</th>
            <th>Region</th>
            <th>Country</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(part, index) in parts" v-bind:key="index">
            <td>{{part.PartNumber}}</td>
            <td>{{part.PartDescription}}</td>
            <td>{{part.Category}}</td>
            <td>{{part.Region}}</td>
            <td>{{part.Country}}</td>
            <td>{{part.Year}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="error">{{error}}</div>
  </div>
</template>

<script>
export default {
  name: "Parts",
  data: () => ({
    partNumber: "CH-9315411-EU",
    parts: [],
    error: "",
    loading: false
  }),
  async mounted() {},
  methods: {
    submit: async function(e) {
      e.preventDefault();
      this.loading = true;

      var params = {};

      if (this.partNumber) {
        params["partNumber"] = encodeURIComponent(this.partNumber);
      }

      var querystring = Object.keys(params)
        .map(key => key + "=" + params[key])
        .join("&");

      var url = "/api/parts";

      if (querystring) {
        url = `${url}?${querystring}`;
      }

      let response = await fetch(url);

      if (response.ok) {
        this.parts = (await response.json()).parts;
      } else {
        this.error = (await response.text()) ?? "Something went wrong";
      }

      this.loading = false;
    }
  }
};
</script>

<style>
.container {
  margin-top: 60px;
}
</style>