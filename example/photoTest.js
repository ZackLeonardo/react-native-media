import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Photo } from '@zdy/react-native-media';

export default class Test extends Component {
  render() {
    const thisProps = {
      uri: 'https://img3.doubanio.com/img/fmadmin/large/708963.jpg',
      onSelection: ()=>{console.log('press Image');},
      selected: false,
      thumbnail: true,
      width: 80,
      height: 80,
    };
    return (
      <View style={styles.container}>
        <Photo
          {...thisProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
