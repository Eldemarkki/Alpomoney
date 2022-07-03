import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { TextInput } from "../components/inputs/TextInput";
import { useUser } from "../hooks/useUser";
import { User } from "@alpomoney/shared";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    axios.post<User>("/api/auth/login", {
      username,
      password
    }).then(response => {
      setUser(response.data);
      navigate("/");
    }).catch(() => {
      console.log("Failed to login");
    });
  };

  return <div>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <TextInput
        id="username"
        value={username}
        onChange={setUsername}
        placeholder="Username"
      />
      <label htmlFor="password">Password</label>
      <TextInput
        id="password"
        value={password}
        onChange={setPassword}
        placeholder="Password"
      />
      <Button type="submit">Login</Button>
    </form>
  </div>;
}
