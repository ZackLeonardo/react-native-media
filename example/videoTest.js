import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  WebView,
  Dimensions,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';

import {Video, Photo} from '@zdy/react-native-media';

export default class Test extends Component {
  _onPress(){
    console.log('_onPressButton');
    // this.webview.postMessage("Hello from RN");
  }

  render() {
    const thisProps = {
      uri: 'https://raw.githubusercontent.com/react-native-community/react-native-video/master/example/broadchurch.mp4',
      lazyLoad: false,
      resizeMode: 'contain',
      useCircleProgress: true,
      thumbnail: true,
      displaySelectionButtons: true,
      selected: false,
      width: 250,
      height: 250,
    };
    return (
      <View style={styles.container}>
        <Video
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
