import {Card, Title, Button} from "@tremor/react";
import { useState, useEffect } from "react";
import { Get } from "../lib/https.jsx";
import { Link } from "wouter";

export default function Apps ({title}){
const [data, setData] = useState()

async function getData() {
  const res = await Get("/marketplace");
  console.log(res)
  setData(res)
}
useEffect(() => {
    getData()
}, [])

return (
  <>
  <Title>{title}</Title>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
    {data?.map((n) => (
      <Card key={n.ID} className="bg-white p-4">
        <img src={n.Image} />
        {n.Name}
        <div>
        <Button className="mt-5" size="lg">Deploy</Button>
        </div>
      </Card>
    ))}
  </div>
  </>
)};