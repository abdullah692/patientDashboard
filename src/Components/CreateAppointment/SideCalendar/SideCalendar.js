import { Calendar, theme } from 'antd'
const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode, 'aaaaaaaa')
}
function handleSelect(date) {
  console.log('Selected date:', date.format('YYYY-MM-DD'))
}

function handleChange(date) {
  console.log('Displayed month and year:', date.format('YYYY-MM'))
}
const SideCalendar = () => {
  const { token } = theme.useToken()
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  }
  return (
    <div style={wrapperStyle}>
      <Calendar
        fullscreen={false}
        onPanelChange={onPanelChange}
        onSelect={handleSelect}
        onChange={handleChange}
      />
    </div>
  )
}
export default SideCalendar
