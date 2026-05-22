//teste tabs, futura tela de adicionar
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Header from '../../components/ui/header';
import { SummaryCard } from '../../components/ui/summaryCard';
import { Colors } from '../../constants/theme';
export default function Add() {
    return (
        <ScrollView style={styles.container}> 
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 5,
        paddingTop: 0,
        marginTop: 0,
    },
});