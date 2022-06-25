import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await axios.post<{ token: string }>("/api/register", { username, password });
    await router.push("/");
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
