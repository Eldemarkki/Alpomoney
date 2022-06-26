import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import styled from "styled-components";
import { Button } from "./Button";

const SidebarComponent = styled.div({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  width: 300,
  borderRadius: 16,
  background: "linear-gradient(to bottom, var(--sidebar-top-color), var(--primary))"
});

const StyledLink = styled.a<{ active?: boolean }>(props => ({
  color: props.active ? "var(--sidebar-active-link-color)" : "var(--sidebar-inactive-link-color)",
  textDecoration: "none",
  transitionDuration: "200ms",
  "&:hover": {
    color: "var(--sidebar-hovered-link-color)"
  }
}));

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


export const Sidebar = () => {
  return <SidebarComponent>
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
      <Button
        fullWidth
        variant="primary"
        extraPadding
        onClick={() => {
          console.log("TODO: open new transaction form");
        }}
      >
        New transaction
      </Button>
    </SidebarBottom>
  </SidebarComponent>;
};
