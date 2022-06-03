import React, { useState } from 'react';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { CategorySelect } from '../CategorySelect';
import { useForm } from 'react-hook-form';
import { InputForm } from '../../components/Form/InputForm';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionType,
} from './styles';
import { useAuth } from '../../hooks/auth';


interface FormData{
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().positive('Somente numeros positivos são permitidos').typeError('Informe um valor numerico')
})

export function Register(){
    const navigation = useNavigation();
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })
    const { user } = useAuth();

    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type)
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }
    
    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    async function handleRegister(form : FormData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo de trasação')
        }
        if(category.key === 'category'){
            return Alert.alert('Selecione o tipo de categoria')
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        }

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });
            navigation.navigate('Listagem');

        } catch (e) {
            console.log(e)
            Alert.alert('Nao foi possivel salvar')
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

        <Form>
            <Fields>
                <InputForm
                    name='name'
                    control={control}
                    placeholder="Nome"
                    autoCapitalize='sentences'
                    autoCorrect={false}
                    error={ errors.name && errors.name.message }
                />

                <InputForm
                    name='amount'
                    control={control}
                    placeholder="Preço"
                    keyboardType='numeric'
                    error={ errors.amount && errors.amount.message }
                />    
            
                <TransactionType>
                    <TransactionTypeButton type="up" title='income' onPress={() => handleTransactionTypeSelect('positive')} isActive={transactionType === 'positive'} />
                    <TransactionTypeButton type="down" title='outcome' onPress={() => handleTransactionTypeSelect('negative')} isActive={transactionType === 'negative'} />
                </TransactionType>

                <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal}/>
            </Fields>
            
            <Button title='Enviar' onPress={handleSubmit(handleRegister)}/>
        </Form>

        <Modal visible={categoryModalOpen}>
            <CategorySelect
                category={category}
                setCategory={setCategory}
                closeSelectCategory={handleCloseSelectCategoryModal}
            />
        </Modal>
        </Container>
        </TouchableWithoutFeedback>
    )
}