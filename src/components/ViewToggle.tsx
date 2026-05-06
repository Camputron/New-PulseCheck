import { GridView, TableRows } from "@mui/icons-material"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { ViewMode } from "@/hooks/useViewMode"

interface ViewToggleProps {
  value: ViewMode
  onChange: (next: ViewMode) => void
}

export default function ViewToggle(props: ViewToggleProps) {
  const { value, onChange } = props

  const handleChange = (_: unknown, next: ViewMode | null) => {
    if (next) onChange(next)
  }

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      onChange={handleChange}
      aria-label="View mode">
      <ToggleButton value="cards" aria-label="Card view">
        <GridView fontSize="small" />
      </ToggleButton>
      <ToggleButton value="table" aria-label="Table view">
        <TableRows fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
