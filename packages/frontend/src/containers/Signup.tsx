//  1. Since we need to show the user a form to enter the confirmation code, 
//  we are conditionally rendering two forms based on if we have a user object or not.
//  {  
//    newUser === null ? renderForm() : renderConfirmationForm();  
//  }

//  2. We are using the LoaderButton component that we created earlier for our submit buttons.

//  3. Since we have two forms we have two validation functions called validateForm and validateConfirmationForm.

//  4. We are setting the autoFocus flags on the email and the confirmation code fields.

//  5. And you’ll notice we are using the useFormFields custom React Hook that we previously 
//  created to handle our form fields.

//  6. In handleSubmit we make a call to signup a user using Auth.signUp(). This creates a new user object.
//  Save that user object to the state using setNewUser.

//  7. In handleConfirmationSubmit use the confirmation code to confirm the user with Auth.confirmSignUp().
//  With the user now confirmed, Cognito now knows that we have a new user that can login to our app.
//  Use the email and password to authenticate exactly the same way we did in the login page. By calling Auth.signIn().
//  Update the App’s context using the userHasAuthenticated function.

//  8. Finally, redirect to the homepage.


import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";
import { useAppContext } from "../lib/contextLib";
import LoaderButton from "../components/LoaderButton";
import { Auth } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { ISignUpResult } from "amazon-cognito-identity-js";
import "./Signup.css";

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });
    const nav = useNavigate();
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [newUser, setNewUser] = useState<null | ISignUpResult>(null);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Stack gap={3}>
                    <Form.Group controlId="confirmationCode">
                        <Form.Label>Confirmation Code</Form.Label>
                        <Form.Control
                            size="lg"
                            autoFocus
                            type="tel"
                            onChange={handleFieldChange}
                            value={fields.confirmationCode}
                        />
                        <Form.Text muted>Please check your email for the code.</Form.Text>
                    </Form.Group>
                    <LoaderButton
                        size="lg"
                        type="submit"
                        variant="success"
                        isLoading={isLoading}
                        disabled={!validateConfirmationForm()}
                    >
                        Verify
                    </LoaderButton>
                </Stack>
            </Form>
        );
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Stack gap={3}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            size="lg"
                            autoFocus
                            type="email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            value={fields.password}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            onChange={handleFieldChange}
                            value={fields.confirmPassword}
                        />
                    </Form.Group>
                    <LoaderButton
                        size="lg"
                        type="submit"
                        variant="success"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Signup
                    </LoaderButton>
                </Stack>
            </Form>
        );
    }

    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}