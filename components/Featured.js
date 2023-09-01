import React, { useContext } from "react";
import Center from "./Center";
import { styled } from "styled-components";
import PrimaryBtn from "./Button";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { CartContext } from "./CartContext";

const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 1.5rem;
    @media screen and (min-width: 768px) {
        font-size: 3rem;
    }
`;

const Desc = styled.p`
    color: #aaa;
    font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1;
    gap: 40px;
    .img-wrapper {
        display: flex;
        justify-content: flex-end;
        img {
            max-width: 100%;
            max-height: 200px;
            display: block;
            margin: 0 auto;
        }
    }
    div:nth-child(1) {
        order: 2;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.1fr 0.9fr;
        div:nth-child(1) {
            order: 0;
        }
        .img-wrapper {
            .img {
                max-width: 100%;
            }
        }
    }
`;

const Column = styled.div`
    display: flex;
    align-items: center;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
`;

const Featured = ({ product }) => {
    const { addProduct } = useContext(CartContext);

    const addFeaturedToCart = () => {
        addProduct((prev) => [...prev, product._id]);
    };

    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>{product.description}</Desc>
                            <ButtonsWrapper>
                                <ButtonLink
                                    href={"/products/" + product._id}
                                    btntype="white"
                                    outline={true}
                                >
                                    Read More
                                </ButtonLink>
                                <Button
                                    btntype="white"
                                    outline={false}
                                    onClick={addFeaturedToCart}
                                >
                                    <CartIcon />
                                    Add to Cart
                                </Button>
                            </ButtonsWrapper>
                        </div>
                    </Column>
                    <Column className="img-wrapper">
                        <img src={product.images[0]}></img>
                    </Column>
                </ColumnsWrapper>
            </Center>
        </Bg>
    );
};

export default Featured;
