import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const nav = useNavigate();
    const { userHasAuthenticated } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    // Grab the email and password and call Amplify’s Auth.signIn() method. 
    // This method returns a promise since it will be logging in the user asynchronously.
    // Use the await keyword to invoke the Auth.signIn() method that returns a promise. 
    // We need to label our handleSubmit method as async.
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await Auth.signIn(email, password);
            userHasAuthenticated(true);
            nav("/");
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert(String(error));
            }
        }
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Stack gap={3}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            size="lg"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button size="lg" type="submit" disabled={!validateForm()}>
                        Login
                    </Button>
                </Stack>
            </Form>
        </div>
    );
}