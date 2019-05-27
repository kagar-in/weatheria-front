<template>
  <div>
    <div class="hero" style="background-image: url('images/retina.jpg');">
      <div class="container">
        <form action="#" class="find-location">
          <vue-autosuggest
            ref="autosuggest"
            @click="clickHandler"
            @keydown.tab.prevent="tabHandler"
            @selected="selectHandler"
            :suggestions="filteredSuggestions"
            :inputProps="inputProps"
            :getSuggestionValue="getSuggestionValue"
          >
            <template slot-scope="{ suggestion }">
              <div>
                <b>{{ suggestion.item.place }}</b>
              </div>
            </template>
          </vue-autosuggest>
          <input type="submit" value="Find" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
var moment = require("moment");
export default {
  name: "search",
  data() {
    return {
      suggestions: [],
      filteredSuggestions: [],
      selected: null,
      inputProps: {
        id: "autosuggest__input",
        onInputChange: this.fetchResults,
        placeholder: "Masukkan nama kota",
        class: "ddd"
      }
    };
  },
  methods: {
    fetchResults(text) {
      var that = this;
      this.search(text, that);
    },
    search: _.debounce((text, that) => {
      axios.get(`http://localhost:8001/api/${text}`).then(response => {
        that.filteredSuggestions = [
          {
            data: response.data.data
          }
        ];
        console.log(that.filteredSuggestions);
      });
    }, 1000),
    selectHandler(item) {
      if (item) {
        this.selected = item.item;
      }
    },
    tabHandler() {
      const {
        listeners,
        setCurrentIndex,
        setChangeItem,
        getItemByIndex
      } = this.$refs.autosuggest;
      setCurrentIndex(0);
      setChangeItem(getItemByIndex(this.$refs.autosuggest.currentIndex), true);
      this.$refs.autosuggest.loading = true;
      listeners.selected(true);
    },
    clickHandler(item) {
      this.loading = false;
      this.fetchResults(item ? item.item.place : "");
    },
    getSuggestionValue(suggestion) {
      const weather = suggestion.item;
      return weather.place;
    },
    moment(info) {
      return moment().format(info);
    }
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
