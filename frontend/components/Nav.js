import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import { TOGGLE_CART_MUTATION } from './Cart';
import { Mutation } from 'react-apollo';

const Nav = () => {
  return (
    <User>
      {
        ({data: { me } }) => (
          <NavStyles>
            <Link href="/">
              <a>Shop</a>
            </Link>
            {me && (
              <>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
                <Link href="/orders">
                  <a>Orders</a>
                </Link>
                <Link href="/me">
                  <a>Account</a>
                </Link>
                <Signout/>
                <Mutation mutation={TOGGLE_CART_MUTATION}>
                  {(toggleCart) => (
                    <button onClick={toggleCart}>My Cart</button>
                  )}
                </Mutation>
              </>
            )}
            {!me && (
              <Link href="/signup">
                <a>Signin</a>
              </Link>
            )}
          </NavStyles>
        )
      }
    </User>
  )
}

export default Nav;