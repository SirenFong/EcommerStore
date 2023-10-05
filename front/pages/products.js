import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductsGrid from "@component/components/ProductsGrid";
import Title from "@component/components/Title";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";

export default function ProductsPage({ products, wishedProducts }) {
    return (
        <>
            <Header />
            <Center>
                <Title>Xem tất cả</Title>
                <ProductsGrid products={products} />
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { _id: -1 } });

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        },
    };
}
