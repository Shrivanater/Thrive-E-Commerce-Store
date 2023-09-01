import { primary } from "@/lib/colors";
import React from "react";
import { css, styled } from "styled-components";

export const ButtonStyle = css`
    border: none;
    border-radius: 5px;
    padding: 5px 15px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    svg {
        height: 16px;
        margin-right: 5px;
    }

    ${(props) =>
        props.block &&
        css`
            display: block;
            width: 100%;
        `}

    ${(props) =>
        props.btntype === "white" &&
        props.outline === true &&
        css`
            background-color: transparent;
            color: #fff;
            outline: 1px solid #fff;
        `}
    ${(props) =>
        props.btntype === "white" &&
        props.outline === false &&
        css`
            background-color: #fff;
            color: #000;
        `}

    ${(props) =>
        props.btntype === "black" &&
        props.outline === true &&
        css`
            background-color: transparent;
            color: #000;
            outline: 1px solid #000;
        `}
    ${(props) =>
        props.btntype === "black" &&
        props.outline === false &&
        css`
            background-color: #000;
            color: #fff;
        `}

    ${(props) =>
        props.btntype === "primary" &&
        props.outline === true &&
        css`
            background-color: transparent;
            color: ${primary};
            outline: 1px solid ${primary};
        `}
    ${(props) =>
        props.btntype === "primary" &&
        props.outline === false &&
        css`
            background-color: ${primary};
            color: #fff;
        `}

    ${(props) =>
        props.size === "l" &&
        css`
            font-size: 1.2rem;
            padding: 10px 20px;
            svg {
                height: 20px;
            }
        `}
`;

const StyledButton = styled.button`
    ${ButtonStyle}
`;

const Button = ({ children, ...rest }) => {
    return <StyledButton {...rest}>{children}</StyledButton>;
};

export default Button;
