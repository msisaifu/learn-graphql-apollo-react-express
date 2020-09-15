import Permission from './../components/Permission';
import Auth from '../components/Auth';

const PermissionPage = () => {
  return (
    <div>
      <Auth>
        <Permission></Permission>
      </Auth>
    </div>
  )
}

export default PermissionPage;