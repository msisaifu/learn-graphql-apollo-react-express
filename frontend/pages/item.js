import SingleItem from '../components/SingleItem';

const ViewItem = ({ query }) => {
  return (
    <div>
      <SingleItem id={query.id}/>
    </div>
  )
}

export default ViewItem;