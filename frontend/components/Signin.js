import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String! 
    $password: String!
  ){
    signin(
      email: $email 
      password: $password
    ){
      id
    }
  }
`;

export default class Signin extends Component {
  state = {
    email: '',
    password: '',
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation 
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
        {(signin, { loading, error }) => (
          <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            const res = await signin();
            // Router.push({
            //   pathname: '/item',
            //   query: { id: res.data.createItem.id }
            // });
            console.log(res)
          }}>
            <Error error={error} />

            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Signin into your account</h2>
              <label htmlFor="email">
                email
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="password">
                password
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  required
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Login</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export { SIGNIN_MUTATION };
