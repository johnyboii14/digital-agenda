import styled from 'styled-components';

const getColor = (props: any): any => {
  if (props.isDragAccept === true) {
    return '#00e676';
  }

  if (props.isDragReject === true) {
    return '#ff1744';
  }

  if (props.isFocused === true) {
    return '#2196f3';
  }

  return '#eeeeee';
};

export default styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  border-width: 2px;
  border-radius: 10px;
  border-color: ${(props: any): any => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: black;
  font-weight: bold;
  font-size: 1.4rem;
  outline: none;
  transition: border 0.24s ease-in-out;
`;
