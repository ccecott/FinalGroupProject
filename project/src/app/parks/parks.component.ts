import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteService } from '../site.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.component.html',
  styleUrls: ['./parks.component.css']
})
export class ParksComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  parksArray = [];
  data: any;
  zoom: any;
  center: any;
  markers: any = [];
  title: any;
  label: any;
  infoContent: any;
  states: any[] = [
    {
      name: "Alabama",
      sc: "AL"
    },
    {
      name: "Alaska",
      sc: "AK"
    },
    {
      name: "American Samoa",
      sc: "AS"
    },
    {
      name: "Arizona",
      sc: "AZ"
    },
    {
      name: "Arkansas",
      sc: "AR"
    },
    {
      name: "California",
      sc: "CA"
    },
    {
      name: "Colorado",
      sc: "CO"
    },
    {
      name: "Connecticut",
      sc: "CT"
    },
    {
      name: "Delaware",
      sc: "DE"
    },
    {
      name: "District Of Columbia",
      sc: "DC"
    },
    {
      name: "Federated States Of Micronesia",
      sc: "FM"
    },
    {
      name: "Florida",
      sc: "FL"
    },
    {
      name: "Georgia",
      sc: "GA"
    },
    {
      name: "Guam",
      sc: "GU"
    },
    {
      name: "Hawaii",
      sc: "HI"
    },
    {
      name: "Idaho",
      sc: "ID"
    },
    {
      name: "Illinois",
      sc: "IL"
    },
    {
      name: "Indiana",
      sc: "IN"
    },
    {
      name: "Iowa",
      sc: "IA"
    },
    {
      name: "Kansas",
      sc: "KS"
    },
    {
      name: "Kentucky",
      sc: "KY"
    },
    {
      name: "Louisiana",
      sc: "LA"
    },
    {
      name: "Maine",
      sc: "ME"
    },
    {
      name: "Marshall Islands",
      sc: "MH"
    },
    {
      name: "Maryland",
      sc: "MD"
    },
    {
      name: "Massachusetts",
      sc: "MA"
    },
    {
      name: "Michigan",
      sc: "MI"
    },
    {
      name: "Minnesota",
      sc: "MN"
    },
    {
      name: "Mississippi",
      sc: "MS"
    },
    {
      name: "Missouri",
      sc: "MO"
    },
    {
      name: "Montana",
      sc: "MT"
    },
    {
      name: "Nebraska",
      sc: "NE"
    },
    {
      name: "Nevada",
      sc: "NV"
    },
    {
      name: "New Hampshire",
      sc: "NH"
    },
    {
      name: "New Jersey",
      sc: "NJ"
    },
    {
      name: "New Mexico",
      sc: "NM"
    },
    {
      name: "New York",
      sc: "NY"
    },
    {
      name: "North Carolina",
      sc: "NC"
    },
    {
      name: "North Dakota",
      sc: "ND"
    },
    {
      name: "Northern Mariana Islands",
      sc: "MP"
    },
    {
      name: "Ohio",
      sc: "OH"
    },
    {
      name: "Oklahoma",
      sc: "OK"
    },
    {
      name: "Oregon",
      sc: "OR"
    },
    {
      name: "Palau",
      sc: "PW"
    },
    {
      name: "Pennsylvania",
      sc: "PA"
    },
    {
      name: "Puerto Rico",
      sc: "PR"
    },
    {
      name: "Rhode Island",
      sc: "RI"
    },
    {
      name: "South Carolina",
      sc: "SC"
    },
    {
      name: "South Dakota",
      sc: "SD"
    },
    {
      name: "Tennessee",
      sc: "TN"
    },
    {
      name: "Texas",
      sc: "TX"
    },
    {
      name: "Utah",
      sc: "UT"
    },
    {
      name: "Vermont",
      sc: "VT"
    },
    {
      name: "Virgin Islands",
      sc: "VI"
    },
    {
      name: "Virginia",
      sc: "VA"
    },
    {
      name: "Washington",
      sc: "WA"
    },
    {
      name: "West Virginia",
      sc: "WV"
    },
    {
      name: "Wisconsin",
      sc: "WI"
    },
    {
      name: "Wyoming",
      sc: "WY"
    }
  ];

  constructor(private service: SiteService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(response => {
      this.zoom = 6;
      let keyTerm: string = null;
      let stateObj: any = null
      if (response.q && response.state) {
        stateObj = this.states.find(state => {
          return state.sc === response.state
        })
        keyTerm = `${response.q} ${stateObj.name}`
        this.setCenter(keyTerm);

        this.getParks(response);
      } else if (response.q) {
        this.setCenter(response.q);

        this.getParks(response);
      } else if (response.state) {
        stateObj = this.states.find(state => {
          return state.sc === response.state
        })
        keyTerm = stateObj.name
        this.setCenter(keyTerm);

        this.getParks(response);
      } else if (!response.q && !response.state) {
        keyTerm = "mt.pleasant, Michigan"
        this.setCenter(keyTerm);
        this.getDefaultParks()
      }
    });
  };

  getDefaultParks() {
    this.service.getDefaultParks().subscribe(response => {
      this.parksArray = response.data;
      this.markers = [];
      this.parksArray.forEach(campground => {
        this.markers.push({
          info: { title: campground.name },
          position: new google.maps.LatLng({
            lat: Number(campground.latitude),
            lng: Number(campground.longitude)
          })
        })
      });

    })
  }

  addToParkInfo(campground): any {
    campground.isclicked === true
    this.service.addToParkInfo(campground)
  }

  openInfo(marker: MapMarker, content: any) {
    this.infoContent = content;
    this.info.open(marker)
  }
  getParks(params: any) {
    this.service.getParks(params).subscribe(response => {
      this.parksArray = response.data;
      this.markers = [];
      this.parksArray.forEach(park => {
        this.markers.push({
          info: { title: park.name },
          position: new google.maps.LatLng({
            lat: Number(park.latitude),
            lng: Number(park.longitude)
          })
        })
      });
    })
  }

  setCenter(location: any) {
    this.service.getGeocode(location).subscribe(response => {
      this.center = new google.maps.LatLng({
        lat: response.results[0].geometry.location.lat,
        lng: response.results[0].geometry.location.lng
      });
    });
  }
};
