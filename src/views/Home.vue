<template>
  <div>
    <div class="site-content">
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
      <div class="forecast-table">
        <div class="container">
          <div class="forecast-container">
            <div class="today forecast">
              <div class="forecast-header">
                <div class="day">{{ moment().format("dddd") }}</div>
                <div class="date">{{ moment().format("Do MMM YY") }}</div>
              </div>
              <!-- .forecast-header -->
              <div class="forecast-content">
                <div class="location" :title="selected.place">
                  {{ selected.point }}
                </div>
                <div class="degree">
                  <div class="num">
                    {{ Math.floor(weather.main.temp) }}
                    <sup>o</sup>C
                  </div>
                  <div class="forecast-icon">
                    <img
                      :src="'images/icons/' + weather.weather[0].icon + '.svg'"
                      alt
                      width="90"
                    />
                  </div>
                </div>
                <span>
                  <img src="images/icon-umberella.png" title="kelembapan" />{{
                    weather.main.humidity
                  }}%
                </span>
                <span>
                  <img src="images/icon-wind.png" />{{
                    Math.ceil((weather.wind.speed * 3600) / 1000)
                  }}
                  km/h
                </span>
                <span>
                  <img src="images/icon-compass.png" />{{
                    degree(weather.wind.deg)
                  }}
                </span>
                <div
                  style="border-style: dotted; padding: 3px ;width: fit-content; margin-top: 10px;"
                >
                  {{ weather.weather[0].description }}
                </div>
              </div>
            </div>
            <div
              class="forecast"
              v-for="(ramalan, index) in forecast"
              :key="index"
            >
              <div class="forecast-header">
                <div class="day">
                  {{
                    moment()
                      .add(index + 1, "days")
                      .calendar(null, {
                        nextDay: "[Besok]",
                        nextWeek: "dddd"
                      })
                  }}
                </div>
              </div>
              <!-- .forecast-header -->
              <div class="forecast-content">
                <div class="forecast-icon">
                  <img
                    :src="'images/icons/' + ramalan.weather[0].icon + '.svg'"
                    alt
                    width="48"
                  />
                </div>
                <div class="degree">
                  {{ Math.floor(ramalan.main.temp) }}
                  <sup>o</sup>C
                </div>
                <img src="images/icon-umberella.png" />
                <span>{{ ramalan.main.humidity }}%</span>
                <div
                  style="border-style: dotted; padding: 3px; margin-top: 10px"
                >
                  {{ ramalan.weather[0].description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <foot></foot>
      <!-- .site-footer -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
var moment = require("moment");
export default {
  name: "home",
  data() {
    return {
      suggestions: [],
      filteredSuggestions: [],
      selected: {
        lat: -7.612,
        lon: 109.354,
        place: "Banyumas, Jawa Tengah, Indonesia",
        point: "Banyumas"
      },
      inputProps: {
        id: "autosuggest__input",
        onInputChange: this.fetchResults,
        placeholder: "Masukkan nama kota"
      },
      weather: {},
      forecast: {}
    };
  },
  methods: {
    fetchResults(text) {
      var that = this;
      this.search(text, that);
    },
    search: _.debounce((text, that) => {
      axios.get(`/api/${text}`).then(response => {
        that.filteredSuggestions = [
          {
            data: response.data.data
          }
        ];
      });
    }, 1000),
    selectHandler(item) {
      if (item) {
        this.selected = item.item;
        this.current();
        this.predict();
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
    moment(...args) {
      moment.locale("id");
      return moment(...args);
    },
    current() {
      axios
        .get("/api/current/", {
          params: {
            lat: this.selected.lat,
            lon: this.selected.lon
          }
        })
        .then(response => {
          this.weather = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    predict() {
      axios
        .get("/api/predict/", {
          params: {
            lat: this.selected.lat,
            lon: this.selected.lon
          }
        })
        .then(response => {
          this.forecast = response.data.list.filter(el => {
            return moment(el.dt_txt).format("HH:mm") === "00:00";
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    degree(angle) {
      var directions = [
        "Utara",
        "Barat Laut",
        "Barat",
        "Barat Daya",
        "Selatan",
        "Tenggara",
        "Timur",
        "Timur Laur"
      ];
      return directions[
        Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8
      ];
    }
  },
  created() {
    this.current();
    this.predict();
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
