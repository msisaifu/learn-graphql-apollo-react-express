import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String! 
    $password: String!
  ){
    signup(
      name: $name
      email: $email 
      password: $password
    ){
      id
    }
  }
`;

export default class Signup extends Component {
  state = {
    name: '',
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
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
        {(signup, { loading, error }) => (
          <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            const res = await signup();
            // Router.push({
            //   pathname: '/item',
            //   query: { id: res.data.createItem.id }
            // });
            console.log(res)
          }}>
            <Error error={error} />

            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Signup into your account</h2>
              <label htmlFor="name">
                name
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="name"
                  required
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </label>
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
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export { SIGNUP_MUTATION };
