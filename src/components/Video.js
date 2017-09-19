import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  WebView,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import CONSTANTS from '../utils/constants';

const iconUnselectedColor = CONSTANTS.ICONUNSELECTEDCOLOR;
const iconSelectedColor = CONSTANTS.ICONSELECTEDCOLOR;

export default class Video extends Component {
  constructor(props){
    super(props);

    const { lazyLoad, uri } = props;

    this.state = {
      uri: lazyLoad ? null : uri,
      progress: 0,
      error: false,
      videoRatio: 1,
    };

    this._onPress = this._onPress.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._toggleSelection = this._toggleSelection.bind(this);
  }

  load() {
    if (!this.state.uri) {
      this.setState({
        uri: this.props.uri,
      });
    }
  }

  _onPress(){
    // console.log('_onPressButton');
    // this.webview.postMessage("Hello from RN");
  }

  _onMessage(event){
    console.log('message from web:'+event.nativeEvent.data);
    if (event.nativeEvent.data) {
      this.setState({
        progress: 1,
      });
    }
  }

  _renderErrorIcon() {
    return (
      <Icon name="error-outline" size={22} color={'red'}/>
    );
  }

  _renderProgressIndicator() {
    const { useCircleProgress } = this.props; // not yet
    const { progress } = this.state;

    if (progress < 1) {
      return <ActivityIndicator animating={ true }/>;
    }
    return null;
  }

  _toggleSelection() {
    // onSelection is resolved in index.js
    // and refreshes the dataSource with new media object
    this.props.onSelection(!this.props.selected);
  }

  _renderSelectionButton() {
    const { progress } = this.state;
    const { displaySelectionButtons, selected, thumbnail } = this.props;

    // do not display selection before image is loaded
    if (!displaySelectionButtons || progress < 1) {
      return null;
    }

    let buttonImage;
    if (thumbnail) {
      let icon = <Icon name="check-circle-o" size={16} color={iconUnselectedColor} style={styles.thumbnailSelectionIcon}/>;
      if (selected) {
        icon = <Icon name="check-circle" size={16} color={iconSelectedColor} style={styles.thumbnailSelectionIcon}/>;
      }
      buttonImage = icon;
    } else {
      let icon = <Icon name="check-circle-o" size={32} color={iconUnselectedColor} style={styles.fullScreenSelectionIcon}/>;
      if (selected) {
        icon = <Icon name="check-circle" size={32} color={iconSelectedColor} style={styles.fullScreenSelectionIcon}/>;
      }
      buttonImage = icon;
    }

    return (
      <TouchableWithoutFeedback onPress={this._toggleSelection} >
        {buttonImage}
      </TouchableWithoutFeedback>
    );
  }

  onNavigationStateChange(navState) {
    if (navState.title && navState.title != 'NaN') {
        const realContentHeight = Number(navState.title) || 0; // turn NaN to 0
        this.setState({videoRatio: realContentHeight});
    }
  }

  render() {
    const { resizeMode, width, height, thumbnail } = this.props;
    const screen = Dimensions.get('window');
    const { uri, error } = this.state;
    const jsCode = "setVideoUri('" + uri + "', false, false)";

    const layoutStyle = {
      width: width || screen.width,
      height: this.state.videoRatio * width || this.state.videoRatio * screen.width,
    };

    return (
      <View style={[styles.container, layoutStyle]}>
        {error ? this._renderErrorIcon() : this._renderProgressIndicator()}
        <TouchableHighlight
          onPress={this._onPress}
          style={[styles.webViewContainer, layoutStyle]}
        >
          <View>
            <WebView
              ref={webview => { this.webview = webview; }}
              style={[styles.webViewContainer, layoutStyle]}
              source={require('./videoContainer.html')}
              allowsInlineMediaPlayback = {true}
              onMessage={this._onMessage}
              javaScriptEnabled={true}
              injectedJavaScript={jsCode}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              />
          </View>
        </TouchableHighlight>
        {this._renderSelectionButton()}
      </View>
    );
  }
}

Video.defaultProps = {
  // uri: 'https://raw.githubusercontent.com/ZackLeonardo/react-native-media/master/example/movie.mp4',
  uri: 'https://raw.githubusercontent.com/react-native-community/react-native-video/master/example/broadchurch.mp4',
  lazyLoad: false,
  resizeMode: 'contain',
  useCircleProgress: true,
  thumbnail: false,
  displaySelectionButtons: true,
  selected: true,
  width: null,
  height: null,
};

Video.propTypes = {
  uri: PropTypes.oneOfType([
    // assets or http url
    PropTypes.string,
    // Opaque type returned by require('./image.jpg')
    PropTypes.number,
  ]).isRequired,
  lazyLoad: PropTypes.bool,
  resizeMode: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  useCircleProgress: PropTypes.bool,
  thumbnail: PropTypes.bool,
  displaySelectionButtons: PropTypes.bool,
  selected: PropTypes.bool,
  onSelection: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'black',
  },
  webViewContainer: {
    justifyContent:'center',
    alignItems:'center',
    minWidth: 245,
    // minHeight: 10,
  },
  thumbnailSelectionIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'transparent',
  },
  fullScreenSelectionIcon: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: 'transparent',
  },
});
