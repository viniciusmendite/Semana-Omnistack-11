import React, { useState, useEffect } from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity, FlatList, Switch, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import logoImg from '../../assets/logo.png';
import ArrowRight from '../../assets/arrow-right.png';
import styles from './styles';
import api from '../../services/api';

export default (props) => {
    const navigation = useNavigation();
    const [darkMode, setDarkMode] = useState(false);
    const [isEnable, setIsEnable] = useState(false);

    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { darkMode, incident });
    }

    function handleChangedSwitch() {
        setIsEnable(!isEnable);
        setDarkMode(!darkMode);
    }

    async function loadIncidents() {
        if (loading) {
            return;
        }

        if (total > 0 & incidents.length === total) {
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });

        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }

    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <SafeAreaView style={[styles.container, (darkMode) ? { backgroundColor: '#1F1F1F' } : { backgroundColor: '#F0F0F5' }]} >
            <StatusBar backgroundColor={(!darkMode) ? '#F0F0F5' : '#1F1F1F'} barStyle={(!darkMode) ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
             </Text>
            </View>

            <View style={styles.areaDarkmode}>
                <Text style={[styles.title, (!darkMode) ? { color: '#13131a' } : { color: '#FFF' }]}>Bem-vindo!</Text>
                <Switch
                    trackColor={{ false: "#1f1f1f", true: "#f0f0f5" }}
                    thumbColor={isEnable ? "#2f2f2f" : "#f0f0f5"}
                    onValueChange={handleChangedSwitch}
                    value={isEnable}
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                />
            </View>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList
                data={incidents}
                style={styles.incidentList}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident }) => (
                    <View style={[styles.incident, (!darkMode) ? { backgroundColor: '#FFF' } : { backgroundColor: '#3f3f3f' }]}>
                        <Text style={[styles.incidentProperty, (!darkMode) ? { color: '#41414d' } : { color: '#FFF' }]}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={[styles.incidentProperty, (!darkMode) ? { color: '#41414d' } : { color: '#FFF' }]}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={[styles.incidentProperty, (!darkMode) ? { color: '#41414d' } : { color: '#FFF' }]}>VALOR:</Text>
                        <Text style={styles.incidentValue}>
                            {Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(incident.value)}
                        </Text>

                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Image source={ArrowRight} style={styles.detailsIcon} />
                        </TouchableOpacity>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}