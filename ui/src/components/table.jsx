import {
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
    Badge
  } from "@tremor/react";
  import { Link } from "wouter";
  
  export default ({cols, data}) => (
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            {cols?.map(col=>(
            <TableHeaderCell>{col.name}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.name}>
              <Link href={`/websites/${item.name}`}>
                <TableCell style={{cursor: "pointer"}}>{item.name}</TableCell>
              </Link>
              <TableCell style={{cursor: "pointer"}}>{item.domain}</TableCell>
              <TableCell>
              <Badge color="emerald">
                {item.domain ? "Published" : "Unpublished"}
              </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );