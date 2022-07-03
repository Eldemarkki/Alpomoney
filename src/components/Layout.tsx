import styled, { createGlobalStyle } from "styled-components";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router";

const GlobalStyles = createGlobalStyle({
  ":root": {
    "--primary": "#0a0e1e",
    "--background-color": "#faebd7",
    "--sidebar-top-color": "#010516",
    "--sidebar-active-link-color": "#fffaf4",
    "--sidebar-inactive-link-color": "#faebd7ba",
    "--sidebar-hovered-link-color": "#faebd7ff"
  }
});

const Container = styled.div({
  display: "flex",
  gap: 30,
  minHeight: "100vh",
  padding: 16
});

const Content = styled.main({
  padding: "24px 16px",
  flex: 1
});

export const Layout = () => {
  return <Container>
    <GlobalStyles />
    <Sidebar />
    <Content>
      <Outlet />
    </Content>
  </Container>;
};
