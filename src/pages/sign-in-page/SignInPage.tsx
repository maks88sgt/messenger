import {Box, Button, Center} from "@chakra-ui/react";
import {FormInput} from "../../components/form-input/FormInput";
import {useState} from "react";

export const SignInPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("Username or email is incorrect");

    const validateUsername = (username: string) => {
        if (username.length < 3) {
            setUsernameError(true);
            setUsernameErrorMessage("Username should contains minimum 3 characters");
            return;
        }
        setUsernameError(false);
    }

    return (
        <Center bg="tomato" h="100vh" color="white">
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <h1>Sign in</h1>
                <FormInput label={"Username or Email"} helperText={"Enter your username or email"}
                           errorMessage={usernameErrorMessage}
                           value={username}
                           isError={usernameError}
                           onChange={(event) => {
                               setUsernameError(false);
                               setUsername(event.target.value);
                           }}
                />
                <FormInput label={"Password"} helperText={"Enter your password"}
                           errorMessage={"Password is incorrect"}
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                />
                <Button onClick={() => {
                    validateUsername(username);
                    console.log("username or email", username);
                    console.log("password", password);
                }}>Submit</Button>
            </Box>
        </Center>
    );
};
