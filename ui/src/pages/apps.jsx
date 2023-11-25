import {Card, Title, Button} from "@tremor/react";
import { useState, useEffect } from "react";
import { Get } from "../lib/https.jsx";
import { Link } from "wouter";
export default function Apps ({title}){
const [data, setData] = useState()

async function getData() {
  const res = await Get("/apps");
  setData(res.response)
}
useEffect(() => {
    getData()
}, [])

return(
  <Card>
    <Title>{title}</Title>
    <Link href="/create-app">
    <Button className="mt-5" size="lg">Create App</Button>
    </Link>
      
  </Card>
)}