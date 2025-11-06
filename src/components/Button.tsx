import { Button } from "antd";

const PrimaryButton = (props: {count: number}) => {
  return (
    <div>
      <Button type="primary">Primary Button {props.count}</Button>
    </div>
  );
};

export default PrimaryButton;
