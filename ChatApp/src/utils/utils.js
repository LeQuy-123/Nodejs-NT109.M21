import {SvgXml} from 'react-native-svg';
import base64 from 'react-native-base64';
import React from 'react';

const getBasse64SvgImg = icon => {
  if (icon) {
    let finalbase64String = '';
    finalbase64String = 'data:image/svg+xml;base64,' + base64.decode(icon);
    return <SvgXml xml={finalbase64String} width={50} height={50} />;
  } else {
    return null;
  }
};

export {getBasse64SvgImg};
