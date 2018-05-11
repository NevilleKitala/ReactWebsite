import React from 'react';
import { Form, Button } from 'semantic-ui-react'

class LoginForm extends React.Component {
  state = {
    data: {
      email: '',
      password: ''
    },
    loading: false,
    errors: {}
  }

onChange = e =>
  this.setState({
     data: { ...this.state.data, [e.target.name]: e.target.value }
   });

  render() {
    const { data } = this.state;
    return(
      <Form>
        <Form.Field>
          <label htmlfor="email">
            Email
          </label>
          <input type="email" id="email" name="email" placeholder="biscuit@example.com" value={data.email} onChange={this.onChange}/>
          <input type="password" id="password" name="email" placeholder="Make it secure!" value={data.password} onChange={this.onChange}/>

        </Form.Field>
        <Button primary>Login</Button>
      </Form>
    );
  }
}

export default LoginForm;
