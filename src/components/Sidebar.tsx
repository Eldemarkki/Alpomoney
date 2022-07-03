import { ReactNode } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "./Button";
import React from "react";
import { useUser } from "../hooks/useUser";
import axios from "axios";

const SidebarComponent = styled.div({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  width: 300,
  borderRadius: 16,
  background: "linear-gradient(to bottom, var(--sidebar-top-color), var(--primary))"
});

const StyledLinkComponent = styled(Link)<{ $isLinkActive?: boolean }>(props => ({
  color: props.$isLinkActive ? "var(--sidebar-active-link-color)" : "var(--sidebar-inactive-link-color)",
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

interface StyledLinkProps {
  href: string,
  children: ReactNode
}

const StyledLink = (props: StyledLinkProps) => {
  const p = useLocation();
  return <StyledLinkComponent to={props.href} $isLinkActive={p.pathname === props.href}>
    {props.children}
  </StyledLinkComponent>;
};

const LogOutLink = () => {
  return <StyledLinkComponent onClick={() => {
    axios.post("/api/auth/logout").then(() => window.location.reload()).catch(e => console.error(e));
  }} to="#">
    🔐 Log out
  </StyledLinkComponent>;
};

export const Sidebar = () => {
  const { user } = useUser();

  return <SidebarComponent>
    <SidebarTop>
      <StyledLink href="/">🏠 Dashboard</StyledLink>
      <hr />
      <StyledLink href="/transactions">💸 Transactions</StyledLink>
      <StyledLink href="/recurring-transactions">🔁 Recurring transactions</StyledLink>
      <hr />
      <StyledLink href="/storages">🏦 Storages</StyledLink>
      <StyledLink href="/sinks">🛒 Sinks</StyledLink>
      <hr />
      {!user && <StyledLink href="/login">🔒 Login</StyledLink>}
      {!user && <StyledLink href="/register">➕ Register</StyledLink>}
      {user && <LogOutLink />}
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
