import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, InjectedFormProps } from 'redux-form';
import { Alert } from 'react-native';
import * as yup from 'yup';

import { Store } from '../../../store';
import * as Form from '../../../modules/form';
import { Typography, Button, BackButton, Spacing } from '../../../components';

import { Container, Content } from './styles';
import { goBack, goToPage } from '../../../navigation';
import { logIn } from '../../../actions/auth';

interface Values {
  username: string;
  password: string;
}

type StoreProps = ReturnType<typeof mapStateToProps>;

type ConnectProps = StoreProps & {
  logIn: Function;
};

type FormProps = InjectedFormProps<Values, ConnectProps>;

type Props = ConnectProps & FormProps;

interface State {
  loading: boolean;
  error: boolean;
}

interface State {
  loading: boolean;
  error: boolean;
}

const VALID_USERNAME = 'asd@asd.asd';
const VALID_PASSWORD = 'asdasd';

class SignInScreen extends React.Component<Props, State> {
  state = {
    loading: false,
    error: false,
  };

  onLogInPressed = async () => {
    const {
      loginForm: { values },
      logIn,
    } = this.props;
    this.setState({ loading: true, error: false });
    await logIn();
    this.setState({ loading: false });
    if (values) Alert.alert('Welcome ' + values.username + '!');
    goToPage('Home');
  };

  validateFields = () => {
    const { touch } = this.props;
    touch('username');
    touch('password');
  };

  render() {
    const { valid: fieldsValid } = this.props;
    const actionDisabled = !fieldsValid;
    const { error, loading } = this.state;

    return (
      <Container testID="signin_screen">
        <BackButton onPress={() => goBack()} />
        <Content>
          <Typography color="black" size={18}>
            Enter your account data
          </Typography>
          <Form.TextField
            testID="email_field"
            name="username"
            label="Email"
            keyboardType="email-address"
          />
          <Form.TextField
            testID="password_field"
            name="password"
            label="Password"
            secureTextEntry
            keyboardType="default"
          />
          {error && (
            <Typography color="black" size={12} textAlign="center">
              Something went wrong. Please try again later
            </Typography>
          )}
          <Spacing />
          <Button
            size="big"
            text={loading ? 'Loading...' : 'Sign In'}
            disabled={actionDisabled || loading}
            onPress={!actionDisabled ? this.onLogInPressed : this.validateFields}
          />
        </Content>
      </Container>
    );
  }
}

const VALIDATION_SCHEMA = yup.object().shape({
  username: yup
    .string()
    .email('Invalid email address')
    .required('Email address is required'),
  password: yup.string().required('Password is required'),
});

function mapStateToProps(store: Store) {
  return {
    loginForm: store.form.login,
  };
}

const mapDispatchToProps = (dispatch: Function) => ({
  logIn: () => dispatch(logIn()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm<Values, ConnectProps>({
    form: 'login',
    destroyOnUnmount: true,
    asyncValidate: Form.validator(VALIDATION_SCHEMA),
    initialValues: { username: VALID_USERNAME, password: VALID_PASSWORD },
  }),
)(SignInScreen);
