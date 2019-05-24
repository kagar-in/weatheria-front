<template>
  <div>
    <div class="hero" style="background-image: url('images/retina.jpg');">
      <div class="container">
        <form action="#" class="find-location">
          <vue-autosuggest
            :suggestions="filteredOptions"
            :on-selected="onSelected"
            :limit="10"
            :input-props="inputProps"
          ></vue-autosuggest>
          <input type="submit" value="Find" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
export default {
  name: "search",
  data() {
    return {
      selected: "",
      options: [
        {
          data: []
        }
      ],
      filteredOptions: [],
      inputProps: {
        id: "autosuggest__input",
        onInputChange: this.onInputChange,
        placeholder: "Input Place Name"
      },
      limit: 10,
      raw: {}
    };
  },
  methods: {
    onSelected(option) {
      // eslint-disable-next-line no-console
      console.log(option);
      this.selected = option.item;
    },
    onInputChange(text) {
      if (text === "" || text === undefined || text.length < 4) {
        this.filteredOptions = [
          {
            data: ["Sedang Mencari Lokasi..."]
          }
        ];
      } else {
        let that = this;
        this.search(text, that);
      }
    },
    search: _.debounce((text, that) => {
      axios.get(`/api/${text}`).then(response => {
        that.raw = response.data;
        that.filteredOptions = [
          {
            data: []
          }
        ];
        that.raw.forEach(item => {
          that.filteredOptions[0].data.push(item.city);
        });
      });
    }, 1000)
  }
};
</script>

<style>
#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  font-family: monospace;
  font-size: 20px;
  border: 1px solid #616161;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #1e202b;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: #1e202b;
  padding: 0px;
  overflow: scroll;
  max-height: 200px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results
  .autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #323544;
  color: #009ad8;
}
</style>
