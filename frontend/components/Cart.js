import React from 'react'
import { Query, Mutation } from 'react-apollo';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User'
import CartItem from './CartItem';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

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
    <User>
      {({ data: { me }}) => {
        if(!me) return null;
        return(
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {(toggleCart) => (        
              <Query query={LOCAL_STATE_QUERY}>
                {({data}) => {
                  return (
                    <CartStyles open={data.cartOpen}>
                      <header>
                        <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
                        <Supreme>{me.name} Cart</Supreme>
                        <p>You Have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart.</p>
                      </header>
                      <ul>
                        {me.cart.map(item =>
                          <CartItem cartItem={item}/>
                        )}
                      </ul>
                      <footer>
                        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                        <SickButton>Checkout</SickButton>
                      </footer>
                    </CartStyles>
                  )
                }}
              </Query>
            )}
          </Mutation>
        )
      }}
    </User>
  )
}

export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }