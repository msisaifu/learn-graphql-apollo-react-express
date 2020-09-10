import UpdateItem from './../components/UpdateItem';

const Update = ({query}) => {
  return (
    <div>
      <UpdateItem id={query.id}></UpdateItem>
    </div>
  )
}

export default Update;