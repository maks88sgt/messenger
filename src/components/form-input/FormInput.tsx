import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import {ChangeEventHandler} from "react";

type FormInputProps = {
    label: string;
    value: string;
    helperText: string;
    errorMessage: string;
    isError?: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
    type?: string;
};

export const FormInput = ({
                              label,
                              value,
                              helperText,
                              errorMessage,
                              isError = false,
                              onChange,
                              type
                          }: FormInputProps) => {
    return (
        <FormControl isInvalid={isError}>
            <FormLabel>{label}</FormLabel>
            <Input type={type} value={value} onChange={onChange} sx={{height: "20px"}}/>
            {!isError ? (
                <FormHelperText>{helperText}</FormHelperText>
            ) : (
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
            )}
        </FormControl>
    );
};
