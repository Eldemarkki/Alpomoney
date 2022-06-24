import styled from "styled-components";

const Container = styled.header({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

interface PageHeaderProps {
  title: string,
  button?: React.ReactNode
}

export const PageHeader = (props: PageHeaderProps) => {
  return <Container>
    <h1>{props.title}</h1>
    {props.button}
  </Container>;
};
