import { View, ActivityIndicator } from 'react-native'
import React from 'react'
import COLORS from '@/constants/colors'

const Loader = ()=> {
    return (
      <View style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: COLORS.background
      }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  
}

export default Loader