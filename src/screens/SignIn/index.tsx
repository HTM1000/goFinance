import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSVG from '../../assets/apple.svg';
import GoogleSVG from '../../assets/google.svg';
import LogoSVG from '../../assets/logo.svg';

import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles';

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);
    const { SignWithGoogle, SignWithApple } = useAuth();
    const theme = useTheme();

    async function handleSignWithGoogle(){

        try {
            setIsLoading(true);
            return await SignWithGoogle();
        } catch (e) {
            console.log(e)
            Alert.alert('Nao foi possivel conectar com a conta google')
            setIsLoading(false);
        }
    }
   
    async function handleSignWithApple(){
        try {
            setIsLoading(true);
            return await SignWithApple();
        } catch (e) {
            console.log(e)
            Alert.alert('Nao foi possivel conectar com a conta google')
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSVG 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                        Controle suas{'\n'}
                        finanças de forma{'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com{'\n'}
                    umas das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton title='Entrar com Google' svg={GoogleSVG} onPress={handleSignWithGoogle} />
                    { Platform.OS === 'ios' &&
                    <SignInSocialButton title='Entrar com Apple' svg={AppleSVG} onPress={handleSignWithApple}/>
                    }      
                </FooterWrapper>

                { isLoading && <ActivityIndicator color={theme.colors.shape} style={{ marginTop: 18 }}/> }
            </Footer>
        </Container>
    )
}