export const DropDown = ({
  itemsList,
  name,
  id,
  label,
  optionStyle,
  onChange,
  dataTestId,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <label htmlFor={id}>{label}</label> &nbsp;&nbsp;
      <select
        name={name}
        id={id}
        style={{ borderRadius: '5px', outline: 'none', margin: '10px' }}
        className={optionStyle}
        onChange={onChange}
        data-test-id={dataTestId}
      >
        {itemsList.map((item, index) => {
          return (
            <option key={index} value={`${item.value}`}>
              {item.key}
            </option>
          );
        })}
      </select>
    </div>
  );
};
