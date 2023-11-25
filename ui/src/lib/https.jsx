import axios from 'axios';
import {Toaster} from "../components/toaster.jsx";
import React from 'react';
import { render } from 'react-dom';
import Cookies from "js-cookie"

const backendURL = "/app";

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
  const domNode = document.getElementById('toaster');

  try {
    const response = await axios.post(backendURL + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.success){
    render(<Toaster text="Created successfully" />, domNode);
    } else {
      render(<Toaster text={response.data.response} />, domNode);
    }
    return response.data;
  } catch (error) {
    // Handle error here
    throw error;
  }
}

export async function Patch(url, data) {
  const token = await Cookies.get('token');
  const domNode = document.getElementById('toaster');
  try {
    const response = await axios.patch(backendURL + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

   if (response.data.success){
    render(<Toaster text="Updated successfully" />, domNode);
    } else {
      render(<Toaster text={response.data.response} />, domNode);
    }
    return response.data;
  } catch (error) {
    // Handle error here
    return render(<Toaster text={error} />, domNode);
  }
}