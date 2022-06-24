import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, ReactNode } from "react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle({
  ":root": {
    "--background-color": "#eaecef",
    "--sidebar-top-color": "#010516",
    "--sidebar-bottom-color": "#0a0e1e"
  }
});

const Container = styled.div({
  display: "flex",
  gap: 30,
  minHeight: "100vh",
  padding: 16
});

const Sidebar = styled.div({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  width: 300,
  borderRadius: 16,
  background: "linear-gradient(to bottom, var(--sidebar-top-color), var(--sidebar-bottom-color))"
});

const SidebarTop = styled.div({
  display: "flex",
  padding: 35,
  gap: 16,
  flexDirection: "column"
});

const SidebarBottom = styled.div({
  color: "white",
  padding: 15
});

const NewTransactionButton = styled.button({
  backgroundColor: "rgb(145, 202, 253)",
  padding: 15,
  borderRadius: 8,
  textAlign: "center",
  color: "black",
  cursor: "pointer",
  border: "none",
  width: "100%"
});

const Content = styled.main({
  padding: "24px 16px",
  flex: 1
});

const StyledLink = styled.a<{ active?: boolean }>(props => ({
  color: props.active ? "white" : "#999",
  textDecoration: "none",
  transitionDuration: "200ms",
  "&:hover": {
    color: "#DDD"
  }
}));

interface StyledNextLinkProps {
  href: string,
  children: ReactNode
}

const StyledNextLink = (props: StyledNextLinkProps) => {
  const router = useRouter();
  return <Link href={props.href} passHref>
    <StyledLink active={router.pathname === props.href}>
      {props.children}
    </StyledLink>
  </Link>;
};

export const Layout = (props: PropsWithChildren) => {
  return <Container>
    <GlobalStyles />
    <Sidebar>
      <SidebarTop>
        <StyledNextLink href="/">🏠 Dashboard</StyledNextLink>
        <hr />
        <StyledNextLink href="/transactions">💸 Transactions</StyledNextLink>
        <StyledNextLink href="/recurring-transactions">🔁 Recurring transactions</StyledNextLink>
        <hr />
        <StyledNextLink href="/storages">🏦 Storages</StyledNextLink>
        <StyledNextLink href="/sinks">🛒 Sinks</StyledNextLink>
        <hr />
        <StyledNextLink href="/login">🔒 Login</StyledNextLink>
        <StyledNextLink href="/register">➕ Register</StyledNextLink>
        <StyledNextLink href="/api/logout">🔐 Log out</StyledNextLink>
      </SidebarTop>
      <SidebarBottom>
        <NewTransactionButton onClick={() => {
          console.log("TODO: open new transaction form");
        }}>
          New transaction
        </NewTransactionButton>
      </SidebarBottom>
    </Sidebar>
    <Content>
      {props.children}
    </Content>
  </Container>;
};
