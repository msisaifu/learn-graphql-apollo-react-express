import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ){
    requestReset(
      email: $email 
    ){
      message
    }
  }
`;

export default class RequestReset extends Component {
  state = {
    email: ''
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation 
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
        {(requestReset, { loading, error, called }) => (
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
            {
              !error && !loading && called && 
              <p>Success! check your email for a reset link</p>
            } 
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request to password reset</h2>
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
              <button type="submit">Request Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export { REQUEST_RESET_MUTATION };
