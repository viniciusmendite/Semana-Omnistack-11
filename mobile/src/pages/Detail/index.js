import React from 'react';
import { View, SafeAreaView, TouchableOpacity, Image, Text, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import email from 'react-native-email';

import styles from './styles';
import logoImg from '../../assets/logo.png';
import ArrowLeft from '../../assets/arrow-left.png';

export default () => {
    const navigation = useNavigation();

    const route = useRoute();
    const darkMode = route.params.darkMode;
    const incident = route.params.incident;

    const message = `Olá ${incident.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}.`;


    function navigateBak() {
        navigation.goBack();
    }

    function sendMail() {
        try {
            email(incident.email, {
                subject: `Herói do caso: ${incident.title}`,
                body: message
            })
        } catch (error) {
            alert('Houve uma falha, tente novamente.');
        }
    }

    function sendWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${incident.whatsapp}&text=${message}`);
    }

    return (
        <SafeAreaView style={[styles.container, (darkMode) ? { backgroundColor: '#1F1F1F' } : { backgroundColor: '#F0F0F5' }]}>
            <View style={styles.header}>
                <Image source={logoImg} />

                <TouchableOpacity onPress={navigateBak}>
                    <Image source={ArrowLeft} style={styles.detailsIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.incident, (!darkMode) ? { backgroundColor: '#FFF' } : { backgroundColor: '#3f3f3f' }]}>
                    <Text style={[styles.incidentProperty, { marginTop: 0 }, (!darkMode) ? { color: '#41414d' } : { color: '#FFF' }]}>ONG:</Text>
                    <Text style={styles.incidentValue}>{incident.name} de {incident.city}/{incident.uf}</Text>

                    <Text style={[styles.incidentProperty, (!darkMode) ? { color: '#41414d' } : { color: '#FFF' }]}>CASO:</Text>
                    <Text style={styles.incidentValue}>{incident.description}</Text>

                    <Text style={[styles.incidentProperty, (!darkMode) ? { color: '#41414d' } : { color: '#FFF' }]}>VALOR:</Text>
                    <Text style={styles.incidentValue}>
                        {Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(incident.value)}
                    </Text>
                </View>

                <View style={[styles.contactBox, (!darkMode) ? { backgroundColor: '#FFF' } : { backgroundColor: '#3f3f3f' }]}>
                    <Text style={[styles.heroTitle, (!darkMode) ? { color: '#13131a' } : { color: '#FFF' }]}>Salve o dia!</Text>
                    <Text style={[styles.heroTitle, (!darkMode) ? { color: '#13131a' } : { color: '#FFF' }]}>Seja o herói desse caso.</Text>

                    <Text style={styles.heroDescription}>Entre em contato:</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.action} onPress={sendWhatsapp}>
                            <Text style={styles.actionText}>WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.action} onPress={sendMail}>
                            <Text style={styles.actionText}>E-mail</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}