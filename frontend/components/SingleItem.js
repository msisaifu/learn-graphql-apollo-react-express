import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import Head from 'next/head';
import styled from 'styled-components';

const SingleItemStyles = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    border-style: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    img {
      width: 100%;
      height: 100%;
      object-fit:contain;
    }
    .details{
      margin:3rem;
      font-style: 2rem;
    }
`;

const SINGLE_ITEMS_QUERY = gql`
  query SINGLE_ITEMS_QUERY($id: ID!) {
    item( where: { id: $id }) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

export default class SingleItem extends Component {
  render() {
    return (
      <Query
        query={SINGLE_ITEMS_QUERY}
        variables={{ id: this.props.id }}
        >
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>Not Found</p>
          if (error) return <Error error={error} />
          const {item} = data;
          console.log(item);
          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits || {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title}/>
              <div className="details">
                <h2> Viewing {item.title} </h2>
                <p>{ item.description }</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    )
  }
}
