import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

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
      <input type="text" id="username" onChange={e => setUsername(e.target.value)} value={username} />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" onChange={e => setPassword(e.target.value)} value={password} />
      <button type="submit">Login</button>
    </form>
  </div>;
}
