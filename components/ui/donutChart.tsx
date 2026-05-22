import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Colors } from '../../constants/theme';

type DonutData = {
  value: number;
  color: string;
  text?: string;
};

type DonutChartProps = {
  data: DonutData[];
  size?: number;
  centerText?: string;
  centerSubtext?: string;
};

export default function DonutChart({ 
  data, 
  size = 160, 
  centerText,
  centerSubtext 
}: DonutChartProps) {
  
  // Filtra valores > 0
  const validData = data.filter(d => d.value > 0);
  
  if (validData.length === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={[styles.emptyRing, { width: size, height: size, borderRadius: size / 2 }]} />
        <View style={styles.center}>
          <Text style={styles.centerText}>0%</Text>
          <Text style={styles.centerSub}>Sem dados</Text>
        </View>
      </View>
    );
  }

  // Converte pro formato do gifted-charts
  const pieData = validData.map(d => ({
    value: d.value,
    color: d.color,
    text: d.text || '',
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <PieChart
        data={pieData}
        donut
        radius={size / 2}
        innerRadius={size / 3}
        innerCircleColor={Colors.card}
        showText={false}
        focusOnPress={false}
        strokeWidth={0}
        strokeColor="transparent"
      />
      <View style={styles.center}>
        {centerText && <Text style={styles.centerText}>{centerText}</Text>}
        {centerSubtext && <Text style={styles.centerSub}>{centerSubtext}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emptyRing: {
    borderWidth: 20,
    borderColor: Colors.border,
  },
  center: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  centerSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
});