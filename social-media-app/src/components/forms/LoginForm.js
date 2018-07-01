import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Validator from 'validator';
import InlineError from "../messages/InlineError"

class LoginForm extends React.Component {
  state = {
    data: {
      email: '',
      password: ''
    },
    loading: false,
    errors: {}
  };

onChange = e =>
  this.setState({
     data: { ...this.state.data, [e.target.name]: e.target.value }
   });

onSubmit = () => {
  const errors = this.validate(this.state.data);
  this.setState({ errors });
  if (Object.keys(errors).length === 0) {
    this.setState({ loading:true });
    this.props
    .submit(this.state.data)
    
  }
};

validate = data => {
  const errors = {};
  if(!Validator.isEmail(data.email)) errors.email = "Invalid email address.";
  if(!data.password) {
    errors.password = "Type in a valid password";
  }/* else if(data.password.length < 8 && data.password.length > 0){
     errors.password = "Your password needs to contain at least 8 characters.";
   } else if (data.password.search(/\d/) === -1) {
    errors.password = "Your password needs to contain a number.";
  } else if (data.password.search(/[a-zA-Z]/) === -1) {
      errors.password = "Your password needs to contain a letter.";
  }*/
  return errors;
};

render() {
  const { data, errors, loading } = this.state;

  return(
    <Form onSubmit={this.onSubmit} loading={loading}>
      { errors.global && (
        <Message negative>
        <Message.Header>Something went wrong.</Message.Header>
        <p>{ errors.global }</p>
      </Message>
    )}
      <Form.Field error={!!errors.email}>
        <label htmlFor="email">
          Email
        </label>
        <input type="email" id="email" name="email" placeholder="biscuit@example.com" value={data.email} onChange={this.onChange}/>
        {errors.email && <InlineError text={errors.email} />}
      </Form.Field>
      <Form.Field error={!!errors.password}>
        <label htmlFor="password">
          Password
        </label>
        <input type="password" id="password" name="password" placeholder="Make it secure!" value={data.password} onChange={this.onChange}/>
        {errors.password && <InlineError text={errors.password} />}
      </Form.Field>
      <Button primary>Login</Button>
    </Form>
    );
  }
}

LoginForm.propTypes = {
  submit: PropTypes.func.isRequired
}

export default LoginForm;
