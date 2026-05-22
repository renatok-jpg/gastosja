import { StyleSheet, Text, View, Image } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
export default function Header() {
    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <Image source={require('../../assets/images/user.png')} style={styles.userImage} />
                <View style={styles.nameContainer}>
                    <Text style={styles.subtitle}>Bem vindo!</Text>
                    <Text style={styles.title}>Ybirá</Text>
                </View>
            </View>

            <View style={styles.notificationButton}> {/* Placeholder para o ícone de notificações ou perfil, se necessário */}
                <Ionicons name="notifications-outline" size={20} color={Colors.icon} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 10,
        width: '100%',
        flexDirection: 'row',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
    },
    nameContainer: {
        marginLeft: 10,
        marginTop: 0,
    },
    title: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 0,
        padding: 20,
    },
    notificationButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.iconBg,
        padding: 0,
        marginBottom: 0,
        alignItems: 'center',
        justifyContent: 'center',   
    },
});