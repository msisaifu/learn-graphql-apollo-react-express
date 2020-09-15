import CreateItem from './../components/CreateItem';
import Auth from '../components/Auth';

const Sell = () => {
  return (
    <div>
      <Auth>
        <CreateItem></CreateItem>
      </Auth>
    </div>
  )
}

export default Sell;