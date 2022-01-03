import SingleProduct from '../../components/SingleProduct';

export default function SingleProductPage({ query }) {
  console.log(query);
  return <SingleProduct id={query.id} />;
}
