import { Card, Title, Button, List, ListItem, Grid, Col, } from "@tremor/react";
import Table from "../components/table";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Get } from "../lib/https";

const subMenuItems = [
  {
    name: "Files",
    link: "/files",
  },
  {
    name: "Domains",
    link: "/domains",
  },
];

const UploadFolder = (title) => {
  const handleUpload = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("folder", event.target.folder.files[0]);

    try {
      const response = await axios.post("/app/upload/" + title, formData);
      console.log("Response from API:", response.data);
    } catch (error) {
      console.error("Error uploading folder:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        {/* <input type="file" name="folder" directory="" webkitdirectory="" /> */}
        <Button className="mt-3" size="lg" type="submit">
          Upload
        </Button>
      </form>
    </div>
  );
};

export default function WebsitesDetails({ title }) {
  const [data, setData] = useState()
  const pathname = window.location.pathname;

  async function getData() {
    const res = await Get("/websites/upload/" + pathname.split("/")[2]);
    setData(res)
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <Fragment>
      <Grid numItems={1} numItemsSm={2} numItemsLg={5} className="gap-12">
        <Col>
          <Card className="max-w-xs">
            <Title></Title>
            <List>
              {subMenuItems.map((item) => (
                <ListItem key={item.name} style={{ cursor: "pointer" }}>
                  <span>{item.name}</span>
                </ListItem>
              ))}
            </List>
          </Card>
        </Col>
        <Col numColSpan={1} numColSpanLg={4}>
          <Card>
            <Title>{title}</Title>
            <UploadFolder title={title} />
            <Table
              cols={[
                { name: "Name" },
                { name: "Content Identifier (CID)" }
              ]}
              data={data}
            />
          </Card>
        </Col>
      </Grid>
    </Fragment>
  )
};
