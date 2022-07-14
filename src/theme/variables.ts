export const themeVariableNames = {
  primaryVariableName: "--primary",
  backgroundColorVariableName: "--background-color",
  sidebarTopColorVariableName: "--sidebar-top-color",
  sidebarActiveLinkColorVariableName: "--sidebar-active-link-color",
  sidebarInactiveLinkColorVariableName: "--sidebar-inactive-link-color",
  sidebarHoveredLinkColorVariableName: "--sidebar-hovered-link-color"
};

export const themeVariables = {
  colors: {
    primary: `var(${themeVariableNames.primaryVariableName})`,
    background: `var(${themeVariableNames.backgroundColorVariableName})`,
    sidebar: {
      top: `var(${themeVariableNames.sidebarTopColorVariableName})`,
      link: {
        active: `var(${themeVariableNames.sidebarActiveLinkColorVariableName})`,
        inactive: `var(${themeVariableNames.sidebarInactiveLinkColorVariableName})`,
        hovered: `var(${themeVariableNames.sidebarHoveredLinkColorVariableName})`
      }
    }
  }
};
