import { Button } from "antd";
import { useEffect, useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("this is use effect");
  },[count]);
  return (
    <>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        Click me
      </Button>
      <p className="read-the-docs">My Count {count}</p>
      <p className="read-the-docs">Count {count}</p>
    </>
  );
};

export default Counter;
