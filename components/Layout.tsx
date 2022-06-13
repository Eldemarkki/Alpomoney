import Link from "next/link";
import { PropsWithChildren } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 30px;
`;

const Header = styled.header`
  display: flex;
  gap: 16px;
`;

export const Layout = (props: PropsWithChildren) => {
  return <Container>
    <Header>
      <Link href="/">Dashboard</Link>
      <Link href="/transactions">Transactions</Link>
      <Link href="/recurring-transactions">Recurring transactions</Link>
      <Link href="/storages">Storages</Link>
      <Link href="/sinks">Sinks</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/api/logout">Log out</Link>
    </Header>
    <main>
      {props.children}
    </main>
  </Container>;
};