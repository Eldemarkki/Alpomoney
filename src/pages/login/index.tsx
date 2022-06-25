import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/inputs/TextInput";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    axios.post<{ token: string }>("/api/login", {
      username,
      password
    }).then(async () => {
      await router.push("/");
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
