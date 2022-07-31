interface SizeVariableNames {
  xs: string,
  md: string,
  lg: string,
  xl: string
}

const generateSizeNames = (name: string): SizeVariableNames => ({
  xs: `--${name}-xs`,
  md: `--${name}-md`,
  lg: `--${name}-lg`,
  xl: `--${name}-xl`
});

const generateSizeVariables = (names: SizeVariableNames): SizeVariableNames => ({
  xs: `var(${names.xs})`,
  md: `var(${names.md})`,
  lg: `var(${names.lg})`,
  xl: `var(${names.xl})`
});

export const themeVariableNames = {
  primaryVariableName: "--primary",
  backgroundColorVariableName: "--background-color",
  sidebarTopColorVariableName: "--sidebar-top-color",
  sidebarActiveLinkColorVariableName: "--sidebar-active-link-color",
  sidebarInactiveLinkColorVariableName: "--sidebar-inactive-link-color",
  sidebarHoveredLinkColorVariableName: "--sidebar-hovered-link-color",
  sizes: {
    ...generateSizeNames("size"),
    xxs: "--size-xxs"
  },
  borderRadiuses: generateSizeNames("border-radius"),
  borderWidths: generateSizeNames("border-width")
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
  },
  sizes:
  {
    ...generateSizeVariables(themeVariableNames.sizes),
    xxs: `var(${themeVariableNames.sizes.xxs})`
  },
  borderRadiuses: generateSizeVariables(themeVariableNames.borderRadiuses),
  borderWidths: generateSizeVariables(themeVariableNames.borderWidths)
};
