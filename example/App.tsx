import React from 'react';
import { View, Text } from 'react-native';
import ModalSection from '@nguyentc21/react-native-modal-view';

import TooltipSection from './TooltipSection';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 50,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
          APP
        </Text>
        <TooltipSection />
      </View>
      <ModalSection />
    </View>
  );
};

export default App;
