import { User } from "@alpomoney/shared";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { TextInput } from "../components/inputs/TextInput";
import { useUser } from "../hooks/useUser";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const signupResponse = await axios.post<User>("/api/auth/signup", { username, password });
    setUser(signupResponse.data);

    navigate("/");
  };

  return <div>
    <h1>Register</h1>
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
      <Button type="submit">Register</Button>
    </form>
  </div>;
}
