import { MenuItem, Select, SelectChangeEvent, SelectProps } from "@mui/material"
import React, { useState } from "react"
import { ThemeType } from "@/types"
import { useThemeContext } from "@/hooks"

type ThemeSelectProps = SelectProps

const ThemeSelect = (props: ThemeSelectProps) => {
  const theme = useThemeContext()
  const [selected, setSelected] = useState(
    (localStorage.getItem("theme") as ThemeType) ?? ThemeType.SYSTEM_THEME
  )

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const selectedTheme = e.target.value as ThemeType
    if (Object.values(ThemeType).includes(selectedTheme)) {
      theme.setTheme(selectedTheme)
      setSelected(selected)
    }
  }

  return (
    <React.Fragment>
      <Select {...props} onChange={handleChange} defaultValue={selected}>
        <MenuItem value={ThemeType.SYSTEM_THEME}>System Theme</MenuItem>
        <MenuItem value={ThemeType.LIGHT}>Light</MenuItem>
        <MenuItem value={ThemeType.DARK}>Dark</MenuItem>
      </Select>
    </React.Fragment>
  )
}

export default ThemeSelect
