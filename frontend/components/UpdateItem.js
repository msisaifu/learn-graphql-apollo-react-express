import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router'
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const SINGLE_ITEMS_QUERY = gql`
  query SINGLE_ITEMS_QUERY($id: ID!) {
    item( where: { id: $id }) {
      id
      title
      price
      description
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String 
    $price: Int
  ){
    updateItem(
      id: $id
      title: $title
      description: $description 
      price: $price
    ){
      id
    }
  }
`;

export default class UpdateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  }
  handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  }
  updateItem = async (e, mutationUpdate) => {
    e.preventDefault();
    const res = await mutationUpdate({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    // Router.push({
    //   pathname: '/item',
    //   query: { id: res.data.updateItem.id }
    // });
    console.log(res)
    console.log("updated")
  }


  render() {
    console.log(this.props.id);
    return(
      <Query query={SINGLE_ITEMS_QUERY} variables={{id: this.props.id}}>
        {({ data, error, loading }) => {
          console.log(data)
          if (loading) return <p>Loading...</p>
          // if (!data.item) return <p>Not Found</p>
          // if (!error) return <Error error={error} />
          
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}
              variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={(e) => this.updateItem(e, updateItem)}>
                  <Error error={error} />

                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Title
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    )
  }
}

export { UPDATE_ITEM_MUTATION };
