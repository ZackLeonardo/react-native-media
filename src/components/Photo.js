import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
// import * as Progress from 'react-native-progress';

import CONSTANTS from '../utils/constants';

const iconUnselectedColor = CONSTANTS.ICONUNSELECTEDCOLOR;
const iconSelectedColor = CONSTANTS.ICONSELECTEDCOLOR;

export default class Photo extends Component {
  constructor(props){
    super(props);

    const { lazyLoad, uri } = props;

    this.state = {
      uri: lazyLoad ? null : uri,
      progress: 0,
      error: false,
    };

    this._onProgress = this._onProgress.bind(this);
    this._onError = this._onError.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._toggleSelection = this._toggleSelection.bind(this);
  }

  load() {
    if (!this.state.uri) {
      this.setState({
        uri: this.props.uri,
      });
    }
  }

  _renderErrorIcon() {
    return (
      <Icon name="error-outline" size={22} color={'red'}/>
    );
  }

  _renderProgressIndicator() {
    const { useCircleProgress } = this.props;
    const { progress } = this.state;

    if (progress < 1) {
      return <ActivityIndicator animating={ true }/>;
      // if (Platform.OS === 'android') {
      //   return <ActivityIndicator animating={ true }/>;
      // }
      //
      // const ProgressElement = useCircleProgress ? Progress.Circle : Progress.Bar;
      // return (
      //   <ProgressElement
      //     progress={progress}
      //     thickness={20}
      //     color={'white'}
      //   />
      // );
    }
    return null;
  }

  _onProgress(event) {
    const progress = event.nativeEvent.loaded / event.nativeEvent.total;
    if (!this.props.thumbnail && progress !== this.state.progress) {
      this.setState({
        progress,
      });
    }
  }

  _onError() {
    this.setState({
      error: true,
      progress: 1,
    });
  }

  _onLoad() {
    this.setState({
      progress: 1,
    });
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
      <TouchableWithoutFeedback onPress={this._toggleSelection}>
        {buttonImage}
      </TouchableWithoutFeedback>
    );
  }

  _renderVideoIcon(){
    return (
      <View>
        <Icon name="play-circle-o" size={40} color={iconSelectedColor} style={styles.videoIcon}/>
      </View>
    );
  }

  render(){
    const { resizeMode, width, height, thumbnail, showVideoIcon } = this.props;
    const screen = Dimensions.get('window');
    const { uri, error } = this.state;

    const layoutStyle = {
      width: width || screen.width,
      height: height || screen.height,
    };

    let source;
    if (uri) {
      // 可以兼容网络资源和本地资源
      source = typeof uri === 'string' ? { uri } : uri;
    }

    return (
      <View style={[styles.container, layoutStyle]}>
        {error ? this._renderErrorIcon() : this._renderProgressIndicator()}
        <Image
          {...this.props}
          style={[styles.image, layoutStyle]}
          source={source}
          onProgress={this._onProgress}
          onError={this._onError}
          onLoad={this._onLoad}
          resizeMode={resizeMode}
        />
        {this._renderSelectionButton()}
        {thumbnail&&showVideoIcon ? this._renderVideoIcon() : null}
      </View>
    );
  }
};

Photo.defaultProps = {
  lazyLoad: false,
  resizeMode: 'contain',
  useCircleProgress: true,
  thumbnail: false,
  displaySelectionButtons: false,
  selected: false,
  showVideoIcon: false,
};

Photo.propTypes = {
  uri: PropTypes.oneOfType([
    // assets or http url
    PropTypes.string,
    // Opaque type returned by require('./image.jpg')
    PropTypes.number,
  ]).isRequired,
  lazyLoad: PropTypes.bool,
  onSelection: PropTypes.func,
  resizeMode: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  useCircleProgress: PropTypes.bool,
  thumbnail: PropTypes.bool,
  displaySelectionButtons: PropTypes.bool,
  selected: PropTypes.bool,
  showVideoIcon: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  videoIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
