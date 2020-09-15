import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const ALL_USERS_QUERY = gql`
  query {
    users{
      id 
      name 
      email 
      permissions
    }
  }
`;

const Permission = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      return (
        <div>
          <Error error={error}/>
          <div>
            <h2>Manage Permission</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map((permission) => 
                    <th>{permission}</th>
                  )}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => <User user={user}/>)}
              </tbody>
            </Table>
          </div>
        </div>
      )
    }}
  </Query>);

class User extends React.Component {
  render() {
    const {name, email, id, permission} = this.props.user;
    return (
      <tr>
        <td>{name}</td>
        <td>{email}</td>
        {possiblePermissions.map((permission) =>
          <td>
            <label htmlFor="{`${id}-permission-${permission}`}">
              <input type="checkbox"/>
            </label>
          </td>
        )}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    )
  }
}

export default Permission;
