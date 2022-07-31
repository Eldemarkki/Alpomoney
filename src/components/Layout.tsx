import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router";
import { themeVariables } from "../theme/variables";

const Container = styled.div({
  display: "flex",
  gap: 30,
  minHeight: "100vh",
  padding: themeVariables.sizes.md
});

const Content = styled.main({
  padding: `${themeVariables.sizes.lg} ${themeVariables.sizes.md}`,
  flex: 1
});

export const Layout = () => {
  return <Container>
    <Sidebar />
    <Content>
      <Outlet />
    </Content>
  </Container>;
};
