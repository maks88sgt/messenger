import {useRouteError} from "react-router-dom";
import {Container} from "@chakra-ui/react";

export const ErrorPage = () => {
    const error = useRouteError() as { statusText: string, message: string, status: number };
    console.error(error);

    return (
        <Container>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.status}</i>
                <i>{error.statusText || error.message}</i>
            </p>
        </Container>
    );
}
