import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import ErrorMessage from '../components/ErrorMessage';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USER_ORDER_QUERY = gql`
  query USER_ORDER_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USER_ORDER_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { allOrders } = data;
  console.log(allOrders);
  return (
    <div>
      <Head>
        <title>Your Orders {allOrders.length}</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={`/order/${order.id}`}>
              <>
                <div className="order-meta">
                  <p>
                    {countItemsInAnOrder(order)} Item{order === 1 ? '' : 's'}
                  </p>
                  <p>
                    {order.items.length} Product
                    {order.items.length === 1 ? '' : 's'}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      key={`image-${item.id}`}
                      src={item.photo.image.publicUrlTransformed}
                      alt={`image-${item.name}`}
                    />
                  ))}
                </div>
              </>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
