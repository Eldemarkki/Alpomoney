import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { TextInput } from "../components/inputs/TextInput";
import { useUser } from "../hooks/useUser";
import { User } from "@alpomoney/shared";
import styled from "styled-components";
import { Link } from "react-router-dom";

const PageContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  gap: 32
});

const FormContainer = styled.div({
  maxWidth: 400,
  display: "flex",
  flexDirection: "column",
  gap: 32,
  width: "100%",
  padding: 32,
  boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.17)"
});

const Form = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: 16
});

const LabelCell = styled.td({
  textAlign: "right",
  paddingRight: 16,
  width: 0
});

const RegisterLink = styled(Link)({
  color: "#242424",
  textDecoration: "none",
  transitionDuration: "200ms",
  "&:hover": {
    color: "black"
  }
});

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    axios.post<User>("/api/auth/login", {
      username,
      password
    }).then(response => {
      setUser(response.data);
      navigate("/");
    }).catch(() => {
      console.log("Failed to login");
    }).finally(() => {
      setIsLoggingIn(false);
    });
  };

  return <PageContainer>
    <FormContainer>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <table>
          <tbody>

            <tr>
              <LabelCell>
                <label htmlFor="username">Username</label>
              </LabelCell>
              <td>
                <TextInput
                  id="username"
                  value={username}
                  onChange={setUsername}
                  placeholder="Username"
                />
              </td>
            </tr>
            <tr>
              <LabelCell>
                <label htmlFor="password">Password</label>
              </LabelCell>
              <td>
                <TextInput
                  id="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Password"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button type="submit" variant="filled" loading={isLoggingIn}>Login</Button>
      </Form>
    </FormContainer>
    <RegisterLink to="/register">Don&apos;t have an account yet? Register</RegisterLink>
  </PageContainer>;
}
