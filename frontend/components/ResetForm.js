import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import propTypes from 'prop-types';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!,
    $password: String!,
    $confirmPassword: String!,
  ){
    resetPassword(
      resetToken: $resetToken,
      password: $password,
      confirmPassword: $confirmPassword
    ){
      id
      email
      name
    }
  }
`;


export default class ResetForm extends Component {
  static propTypes = {
    resetToken: propTypes.string.isRequired
  }

  state = {
    password: '',
    confirmPassword: '',
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          ...this.state,
          resetToken: this.props.resetToken
          }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(requestReset, { loading, error }) => (
          <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            const res = await requestReset();
            // Router.push({
            //   pathname: '/item',
            //   query: { id: res.data.createItem.id }
            // });
            console.log(res)
          }}>
            <Error error={error} />

            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request to password reset</h2>
              <label htmlFor="password">
                password
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="confirmPassword">
                confirmPassword
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Change Password</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export { RESET_MUTATION };
