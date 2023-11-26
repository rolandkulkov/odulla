import axios from 'axios';
import {Toaster} from "../components/toaster.jsx";
import React from 'react';
import { createRoot } from 'react-dom/client';
import Cookies from "js-cookie"

const backendURL = "/app";

 const domNode = document.querySelector('#toaster');
 const root = createRoot(domNode);
 console.log(root)

export async function Get(url) {
  const token = await Cookies.get('token');
  try {
    const response = await axios.get(backendURL + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: false,
    });
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
}

export async function Post(url, data) {
  const token = await Cookies.get('token');
  try {
    const response = await axios.post(backendURL + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data.error){
    root.render(<Toaster text={"Created successfully PORT:" + response.data.port} />);
    } else {
      root.render(<Toaster text={response.data.response} />);
    }
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
}

export async function Patch(url, data) {
  const token = await Cookies.get('token');
    try {
    const response = await axios.patch(backendURL + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

   if (response.data.success){
    root.render(<Toaster text="Updated successfully" />);
    } else {
      root.render(<Toaster text={response.data.response} />);
    }
    return response.data;
  } catch (error) {
    // Handle error here
    return root.render(<Toaster text={error} />);
  }
}