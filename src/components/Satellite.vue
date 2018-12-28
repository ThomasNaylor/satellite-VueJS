<template>
  <div id="map__cont">
    <div class="map">
      <!-- start google map container -->
      <gmap-map
        :center="center"
        :zoom="3"
        :options="mapOptions"
        map-type-id="hybrid"
        style="width:100%;  height:100vh;">
        <!-- start google map marker -->
        <gmap-marker
          v-for="(m, mapKey) in markers"
          :key="mapKey"
          :position="m.position"
          :icon="m.icon"
          @click="openInfoWindow()">
        </gmap-marker>
        <!-- end google map marker -->

        <!-- start google polyline -->
        <gmap-polyline
          :options="polylineOptions">
        </gmap-polyline>
        <!-- end google polyline -->

        <!-- start google info-window -->
        <gmap-info-window
          v-for="(m, infoKey) in markers"
          :key="infoKey"
          :opened="infoWindowOpen"
          :options="infoWindowOptions"
          :position="m.position"
          @closeclick="infoWindowOpen=false">
          <div class="info__window">
            <h3>SPACE STATION INFORMATION</h3>
            <p>This is a simple example of how we can integrate multiple api's to create
            something useful from the data provided. Here you will see a satellite plot a
            trial across the globe with googles polyline function. (updates every 60 seconds)</p>
            <h4>Raw satellite data below:</h4>
            <div v-for="i in infoWindow">
              <span>Satelitte: {{ i.name }}</span><br>
              <span>Visibility: {{ i.visibility }}</span><br>
              <span>Altitude: {{ i.altitude }}</span><br>
              <span>Velocity: {{ i.velocity }}</span><br>
              <span>Latitude: {{ i.lat }}</span><br>
              <span>Longitude: {{ i.lng }}</span>
            </div>
          </div>
        </gmap-info-window>
        <!-- end google info-window -->
      </gmap-map>
      <!-- end google map container -->
    </div>
  </div>
</template>

<script>

import satgif from '../assets/spacestation/img/sat1.gif';

export default {
  // global variables
  name: 'spacestation',
  data: () => ({
    dialog: false,
    model: null,
    center: { Lat: 0, Lng: 0 },
    markers: [],
    polylineOptions: { path: [], strokeOpacity: 0, icons: [{ icon: { path: 'M 0, -1 0,1', strokeOpacity: 1, scale: 4 }, offset: '0', repeat: '20px' }] },
    infoWindow: [],
    infoWindowOptions: { pixelOffset: { width: 0, height: -45 } },
    mapOptions: { disableDefaultUI: true },
    infoWindowOpen: true,
    satgif: satgif
  }),

  watch: {
    dialog (val) {
      val || this.close();
    },

    // removes markers from the array to keep satellite on the latest postion
    markers (val) {
      if(this.markers.length >= 2) {
        return this.markers.shift();
      }
    },

    // removes markers from the array to keep info-window on the latest postion
    infoWindow (val) {
      if(this.infoWindow.length >= 2) {
        return this.infoWindow.shift();
      }
    },

    // removes polylines behind satellite after 100 traces
    polylineOptions (val) {
      if(this.polylineOptions.path.length >= 100) {
        return this.polylineOptions.path.shift();
      }
    }
  },

  // starts the app when it is mounted.
  mounted() {
    this.getSpaceStation();
    setInterval (this.getSpaceStation, 60000);
  },

  methods: {
    // get the external api data from 'whereisiis' and 'googlemaps' to plot google maps.
    getSpaceStation () {
      this.axios.get('https://api.wheretheiss.at/v1/satellites/25544')
      .then((response) => {

        let pos = new google.maps.LatLng(parseFloat(response.data.latitude), parseFloat(response.data.longitude));

        const marker = new google.maps.Marker({
          position: pos,
          optimized: false,
          icon: this.satgif
        });

        const center = pos;

        this.polylineOptions.path.push(
          pos
        );

        this.infoWindow.push({
          name: response.data.name,
          velocity: response.data.velocity,
          altitude: response.data.altitude,
          visibility: response.data.visibility,
          lat: response.data.latitude,
          lng: response.data.longitude,
        });

        this.center = center;
        this.markers.push(marker);

      });
    },
    openInfoWindow () {
      this.infoWindowOpen = true;
    },
    close () {
      this.dialog = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map__cont {
  min-width: 100%;
  min-height: 100%;
}
.info__window {
  width: 250px;
}
</style>
