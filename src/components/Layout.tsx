import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router";

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
    <Sidebar />
    <Content>
      <Outlet />
    </Content>
  </Container>;
};
