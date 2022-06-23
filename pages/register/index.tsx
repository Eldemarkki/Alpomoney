import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

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
      <input type="text" id="username" onChange={e => setUsername(e.target.value)} value={username} />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" onChange={e => setPassword(e.target.value)} value={password} />
      <button type="submit">Register</button>
    </form>
  </div>;
}
