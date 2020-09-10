import ResetForm from './../components/ResetForm';

const Reset = (props) => {
  return (
    <div>
      <ResetForm resetToken={props.query.resetToken}></ResetForm>
    </div>
  )
}

export default Reset;