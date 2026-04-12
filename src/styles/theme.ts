import { createTheme, PaletteMode } from "@mui/material"
import { getDesignTokens } from "./themePrimitives"
import {
  inputsCustomizations,
  surfacesCustomizations,
  feedbackCustomizations,
  navigationCustomizations,
  dataDisplayCustomizations,
} from "./customizations"

export function createCustomTheme(mode: PaletteMode) {
  return createTheme({
    ...getDesignTokens(mode),
    components: {
      ...inputsCustomizations,
      ...surfacesCustomizations,
      ...feedbackCustomizations,
      ...navigationCustomizations,
      ...dataDisplayCustomizations,
    },
  })
}
