import React from 'react'
import { Query, Mutation } from 'react-apollo';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import gql from 'graphql-tag';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

export default function Cart() {
  return (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {(toggleCart) => (        
        <Query query={LOCAL_STATE_QUERY}>
          {({data}) => {
            return (
              <CartStyles open={data.cartOpen}>
                <header>
                  <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
                  <Supreme>Your Cart</Supreme>
                  <p>You Have __ items in your cart.</p>
                </header>
          
                <footer>
                  <p>10.10</p>
                  <SickButton>Checkout</SickButton>
                </footer>
              </CartStyles>
            )
          }}
        </Query>
      )}
    </Mutation>
  )
}

export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }