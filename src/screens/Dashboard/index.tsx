import React from 'react';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { HightlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HightlightCards,
    Transaction,
    Title,
    TransactionList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard(){
    const data : DataListProps[] = {
        id: '1',
        type: 'positive',
        title: "Desonvolvimento",
        amount: "12.000,00",
        category: {
            name: 'Vendas',
            icon: 'dollar-sign',
        },
        date: '13/05/2022',
    }
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: "https://avatars.githubusercontent.com/u/90485852?v=4" }} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Henrique</UserName>
                        </User>
                    </UserInfo>
                    
                    <Icon name="power" />
                </UserWrapper>
            </Header>


            <HightlightCards>

                <HightlightCard
                    title="Entradas"
                    amount="17.400,00"
                    lastTransaction="Ultima entrada dia 13 de maio"
                    type="up"
                />
                 <HightlightCard
                    title="Saidas"
                    amount="1.259,00"
                    lastTransaction="Ultima saida dia 13 de maio"
                    type="down"
                />
                 <HightlightCard
                    title="Total"
                    amount="16.141,00"
                    lastTransaction="01 á 16 de maio"
                    type="total"
                />

            </HightlightCards>

            <Transaction>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item}/>}
                />
 
            </Transaction>
        </Container>
    )
}