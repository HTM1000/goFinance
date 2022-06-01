import React, { useState } from 'react';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { Modal } from 'react-native';
import { CategorySelect } from '../CategorySelect';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionType,
} from './styles'

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    function handleTransactionTypeSelect(type: 'up' | 'down'){
        setTransactionType(type)
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }
    
    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    return (
        <Container>
            <Header>
                <Title></Title>
            </Header>

        <Form>
            <Fields>
                <Input 
                    placeholder="Nome"
                />

                <Input 
                    placeholder="Preço"
                />    
            
                <TransactionType>
                    <TransactionTypeButton type="up" title='income' onPress={() => handleTransactionTypeSelect('up')} isActive={transactionType === 'up'} />
                    <TransactionTypeButton type="down" title='outcome' onPress={() => handleTransactionTypeSelect('down')} isActive={transactionType === 'down'} />
                </TransactionType>

                <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal}/>
            </Fields>

            <Button title='Enviar' />
        </Form>

        <Modal visible={categoryModalOpen}>
            <CategorySelect
                category={category}
                setCategory={setCategory}
                closeSelectCategory={handleCloseSelectCategoryModal}
            />
        </Modal>
        </Container>
    )
}