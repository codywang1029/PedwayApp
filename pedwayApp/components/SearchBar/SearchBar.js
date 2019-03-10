import styles from './styles';
import {Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';

export default class SearchBar extends React.Component{
  render(){
    return(
      <TouchableOpacity
        style={[styles.floating, styles.searchBox]}
      >
        <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          <Text style={{fontSize: 18}}>Enter your destination...</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

