import React from 'react';
import useSwr from 'swr';
import GoogleMapReact from 'google-map-react';
import useSupercluster from "use-supercluster";
import google_map_api from '../../../pkg/api_key';
import coordinate from '../../../pkg/api_key';

export const GoogleMap = (props) => {

  // 1 map setup

  // 2 load and format data

  // 3 get clusters

  // render map

  return(
    <div>
      <GoogleMapReact 
        bootstrapURLKeys={{ key: google_map_api}}
        defaultCenter={{lat: coordinate.latitude, lng: coordinate.longitude}}
      >
        {
          // markers
        }
      </GoogleMapReact>
    </div>
  )
}