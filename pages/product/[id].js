import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import React, { useContext } from "react";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { styled } from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import { CartContext } from "@/components/CartContext";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin: 40px 0;
    @media screen and (min-width: 768px) {
        grid-template-columns: 0.8fr 1.2fr;
    }
`;

const PriceRow = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const Price = styled.span`
    font-size: 1.4rem;
`;

const ProductPage = ({ product }) => {
    const { addProduct } = useContext(CartContext);
    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <p>{product.description}</p>
                        <PriceRow>
                            <Price>₹{product.price}</Price>
                            <Button
                                btntype="primary"
                                outline={true}
                                onClick={() => addProduct(product._id)}
                            >
                                <CartIcon />
                                Add to Cart
                            </Button>
                        </PriceRow>
                    </div>
                </ColWrapper>
            </Center>
        </>
    );
};

export default ProductPage;

export async function getServerSideProps(context) {
    await mongooseConnect();
    const product = await Product.findById(context.query.id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        },
    };
}
