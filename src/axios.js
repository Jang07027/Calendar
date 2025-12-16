import React from "react";
import axios from "axios";

axios.get("")
    .then(response => {
    console.log(response.data); // 서버에서 받은 데이터 출력
    })
    .catch(error => {
    console.error("Error:", error);
    });