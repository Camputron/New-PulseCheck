import { IconButton } from "@mui/material"
import { Brightness4, Brightness7 } from "@mui/icons-material"
import { useThemeContext } from "@/hooks/useThemeContext"

const ThemeToggleButton = () => {
  const theme = useThemeContext()

  return (
    <div>
      <IconButton onClick={theme.toggleTheme} color='inherit'>
        {theme.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </div>
  )
}

export default ThemeToggleButton
