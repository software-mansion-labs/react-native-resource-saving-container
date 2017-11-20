//
// Copyright (c) Software Mansion
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

import React from 'react';
import { StyleSheet, View } from 'react-native';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its conatiner

const ResourceSavingContainer = ({ style, visible, children }) => (
  <View style={style} collapsable={false} removeClippedSubviews={true}>
    <View style={visible ? styles.innerAttached : styles.innerDetached}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  innerAttached: {
    flex: 1,
  },
  innerDetached: {
    flex: 1,
    left: FAR_FAR_AWAY,
  },
});

export default ResourceSavingContainer;
