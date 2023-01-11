import { useQuery } from "@tanstack/react-query";
import { GASClient } from "gas-client";
import { useEffect } from "react";
import * as server from "../server/main";

const { serverFunctions } = new GASClient<typeof server>();

const fetcher = async () => {
  const { data } = await serverFunctions.getSheetData();
  return data;
};

function App() {
  const { data, error } = useQuery(["data"], fetcher);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return <></>;
}

export default App;
