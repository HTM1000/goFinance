import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { HightlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useAuth,  } from '../../hooks/auth'

import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    LogoutButton,
    Icon,
    HightlightCards,
    Transaction,
    Title,
    TransactionList,
    LoadingContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HightlightProps {
    amount: string;
    lastTransaction: string;
}
interface HightlightData {
    entries: HightlightProps;
    expensive: HightlightProps;
    total: HightlightProps;
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [hightlightData, setHightlightData] = useState<HightlightData>({} as HightlightData);
    const { user, SignOut } = useAuth();

    function getLastTransactionDate(collections: DataListProps[], type: 'positive' | 'negative'){
        const collectionFiltered = collections.filter((transaction) => transaction.type === type);

        if(collectionFiltered.length === 0){
            return 0
        }

        const lastTransaction = new Date(Math.max.apply(Math, collectionFiltered.map((transaction) => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString("pt-BR", { month: "long" })}`;
    }

    async function loadTransaction(){
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesSum = 0;
        let expensiveSum = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesSum += Number(item.amount);
            } else {
                expensiveSum += Number(item.amount);
            }

            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }

        });

        setTransactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = lastTransactionExpensives === 0 ? "Nao há transacoes cadastradas" : ` 01 a ${lastTransactionExpensives}`;

        const total = entriesSum - expensiveSum;

        setHightlightData({
            entries: {
                amount: entriesSum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0 ? "Nao há entradas cadastradas" : `Ultima entrada dia ${lastTransactionEntries}`
            },
            expensive: {
                amount: expensiveSum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensives === 0 ? "Nao há saidas cadastradas" : `Ultima entrada dia ${lastTransactionExpensives}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval,
            },
        })

        setIsLoading(false);
    }

    useEffect(() => {
       loadTransaction();
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []));

    return (
        <Container>
            {
                isLoading ?
                <LoadingContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    /> 
                </LoadingContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{ uri: user.photo }} />
                                    <User>
                                        <UserGreeting>Olá,</UserGreeting>
                                        <UserName>{ user.name }</UserName>
                                    </User>
                                </UserInfo>
                                <LogoutButton onPress={SignOut}>
                                    <Icon name="power" />
                                </LogoutButton>
                            </UserWrapper>
                        </Header>


                        <HightlightCards>

                            <HightlightCard
                                type="up"
                                title="Entradas"
                                amount={hightlightData.entries.amount}
                                lastTransaction={hightlightData.entries.lastTransaction}
                            
                            />
                            <HightlightCard
                                type="down"
                                title="Saidas"
                                amount={hightlightData.expensive.amount}
                                lastTransaction={hightlightData.expensive.lastTransaction}
                            
                            />
                            <HightlightCard
                                type="total"
                                title="Total"
                                amount={hightlightData.total.amount}
                                lastTransaction={hightlightData.total.lastTransaction}
                        
                            />

                        </HightlightCards>

                        <Transaction>
                            <Title>Listagem</Title>

                            <TransactionList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item}/>}
                            />
            
                        </Transaction>
                    </>
            }
        </Container>
    )
}