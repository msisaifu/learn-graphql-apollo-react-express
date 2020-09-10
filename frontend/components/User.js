import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import propTypes from 'prop-types'
import styled from 'styled-components';

const SingleItemStyles = styled.div`
`;

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me{
      id
      email
      name
      permissions
    }
  }
`;

const User = props => (
  <Query
    {...props}
    query={CURRENT_USER_QUERY}
  >
    {payload => props.children(payload)}
  </Query>
);

User.propTypes = {
  children: propTypes.func.isRequired
}

export default User;
export { CURRENT_USER_QUERY };