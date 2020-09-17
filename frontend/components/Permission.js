import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId){
      id
      permissions
      name
      email
    }
  }
`;

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
                    <th key={permission}>{permission}</th>
                  )}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => <User user={user} key={user.id}/>)}
              </tbody>
            </Table>
          </div>
        </div>
      )
    }}
  </Query>);

class User extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      emial: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired
  }
  state = {
    permissions: this.props.user.permissions
  }
  handlePermissionChange = e => {
    const { value, checked } = e.target;
    let updatedPermissions = [...this.state.permissions];

    if(checked){
      updatedPermissions.push(value);
    } else {
      updatedPermissions = updatedPermissions.filter((e) => e !== value);
    }
    this.setState({ permissions: updatedPermissions });
  }
  render() {
    const {name, email, id, permission} = this.props.user;
    return (
      <Mutation 
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
        >
          {(updatePermissions, { loading, error }) => (
            <>
              {error && (<tr><td colSpan="8">
               <Error error={error}/></td></tr>)
              }
              <tr>
                <td>{name}</td>
                <td>{email}</td>
                {possiblePermissions.map((e) =>
                  <td key={`${id}-${e}`}>
                    <label htmlFor="{`${id}-permission-${e}`}">
                      <input 
                        type="checkbox"
                        checked={this.state.permissions.includes(e)}
                        value={e}
                        onChange={this.handlePermissionChange}
                        />
                    </label>
                  </td>
                )}
                <td>
                  <SickButton
                    type="button"
                    disabled={loading}
                    onClick={updatePermissions}
                  >Updat{loading ? 'ing' : 'e'}</SickButton>
                </td>
              </tr>
            </>
          )}
      </Mutation>
    )
  }
}

export default Permission;
