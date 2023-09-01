import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    margin-top: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr 0.8fr;
        gap: 40px;
    }
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
    height: fit-content;
    margin-bottom: 40px;
`;

const Title = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
`;

const ProductInfoCell = styled.div`
    padding: 10px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img {
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        width: 100px;
        height: 100px;
        img {
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantitiyLabel = styled.span`
    display: block;
    padding: 0 15px;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

const CartPage = () => {
    const { cartProducts, addProduct, removeProduct, clearCart } =
        useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post("/api/cart", { ids: cartProducts }).then((response) => {
                setProducts(response.data);
            });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        if (window?.location.href.includes("success")) {
            setIsSuccess(true);
            clearCart();
        }
    }, []);

    const moreOfThisProduct = (id) => {
        addProduct(id);
    };

    const lessOfThisProduct = (id) => {
        removeProduct(id);
    };

    const goToPayment = async () => {
        const response = await axios.post("/api/checkout", {
            name,
            email,
            city,
            postalCode,
            address,
            country,
            cartProducts,
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
    };

    let total = 0;
    for (const productId of cartProducts) {
        const price =
            products.find((product) => product._id === productId)?.price || 0;
        total += price;
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thanks for your order!!</h1>
                            <p>Please check your email for further details</p>
                        </Box>
                    </ColumnsWrapper>
                </Center>
            </>
        );
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <Title>Cart</Title>
                        {!cartProducts?.length && <div>Your cart is empty</div>}
                        {products?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img
                                                        src={product.images[0]}
                                                        alt=""
                                                    />
                                                </ProductImageBox>

                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button
                                                    onClick={() =>
                                                        lessOfThisProduct(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    -
                                                </Button>
                                                <QuantitiyLabel>
                                                    {
                                                        cartProducts.filter(
                                                            (id) =>
                                                                id ===
                                                                product._id
                                                        ).length
                                                    }
                                                </QuantitiyLabel>

                                                <Button
                                                    onClick={() =>
                                                        moreOfThisProduct(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    +
                                                </Button>
                                            </td>
                                            <td>
                                                ₹
                                                {product.price *
                                                    cartProducts.filter(
                                                        (id) =>
                                                            id === product._id
                                                    ).length}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>₹{total}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        )}
                    </Box>
                    {!!cartProducts?.length && (
                        <Box>
                            <Title>Order Information</Title>
                            <Input
                                type="text"
                                placeholder="Name"
                                value={name}
                                name="name"
                                onChange={(ev) => setName(ev.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="Email"
                                value={email}
                                name="email"
                                onChange={(ev) => setEmail(ev.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="Address"
                                value={address}
                                name="address"
                                onChange={(ev) => setAddress(ev.target.value)}
                            />
                            <CityHolder>
                                <Input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    name="city"
                                    onChange={(ev) => setCity(ev.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="Postal Code"
                                    value={postalCode}
                                    name="postalCode"
                                    onChange={(ev) =>
                                        setPostalCode(ev.target.value)
                                    }
                                />
                            </CityHolder>
                            <Input
                                type="text"
                                placeholder="Country"
                                value={country}
                                name="country"
                                onChange={(ev) => setCountry(ev.target.value)}
                            />
                            <Button
                                btntype="black"
                                block={true}
                                outline={false}
                                onClick={goToPayment}
                            >
                                Continue to Payment
                            </Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    );
};

export default CartPage;
