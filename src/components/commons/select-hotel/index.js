import React, { useState, useEffect} from 'react';
import { Scroll } from '../scroll';
import { SearchHotel } from '../search-hotel';
import { _getRequest } from '../../../pkg/api';
import { message } from 'antd';

export const SelectHotel = props => {
  const { selectedHotel = () => {} } = props;
  const [ hotels, setHotels ] = useState([]);
  const [ query, setQuery ] = useState({});
  const [ selectHotel, setSelectHotel ] = useState({});

  useEffect(()=>{
    if(!selectHotel) return;
    selectedHotel(selectHotel);
  }, [selectHotel])
  useEffect(()=>{
    const getData = async() => {
      const res = await _getRequest('hotel', query);
      if(!res.success) {
        message.error(res.error);
      }
      setHotels(res.result.hotels);
      setSelectHotel({});
    }
    getData();
  },[query])
  const onSearch = (value) => {
    setQuery({
      searchText: value
    })
  }
  const onSelect = (item) => {
    setSelectHotel(item);
  }
  return <>
    <SearchHotel onSearch={onSearch}/>
    <Scroll hotels={hotels} onSelect={onSelect} hotel={selectHotel}/>

  </>
}