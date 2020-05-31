<template>
  <div>
    <h3>Parts</h3>
    <div>
      <form @submit="submit">
        <div>
          <label for="partNumber">Part Number</label>
          <input
            type="text"
            name="partNumber"
            id="partNumber"
            placeholder="Part Number"
            v-model="search.partNumber"
          />
        </div>
        <div>***Not Impl***</div>
        <div>
          <label for="partName">Part Name</label>
          <input type="text" name="partName" id="partName" placeholder="Part Name" />
        </div>
        <div>
          <label for="region">Region</label>
          <input type="text" name="region" id="region" placeholder="Region" />
        </div>
        <div>
          <label for="country">Country</label>
          <input type="text" name="country" id="country" placeholder="Country" />
        </div>
        <div>
          <label for="year">Year</label>
          <input type="text" name="year" id="year" placeholder="year" />
        </div>
        <div>
          <input type="submit" name="submit" id="submit" value="Search" />
        </div>
      </form>
    </div>
    <div v-if="error">{{error}}</div>
    <div>
      <table>
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
  </div>
</template>

<script>
export default {
  name: "Parts",
  data: () => ({
    search: {
      partNumber: ""
    },
    parts: [],
    error: ""
  }),
  async mounted() {},
  methods: {
    submit: async function(e) {
      e.preventDefault();

      var params = {};

      if (this.search.partNumber) {
        params["partNumber"] = encodeURIComponent(this.search.partNumber);
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

      console.log("o hai");
    }
  }
};
</script>

<style>
</style>