import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id){
      id
      quantity
    }
  }
`;

export default class AddToCart extends Component {
  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{ id }}>
        {(addToCart, { data, error }) => (
          <button
          onClick={addToCart}
          >Add To Cart
          </button>
        )}
      </Mutation>
    )
  }
}

export { ADD_TO_CART_MUTATION };
