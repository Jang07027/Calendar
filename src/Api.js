const formData = new FormData();
formData.append("title", title);
formData.append("content", content);
formData.append("diaryDate", date);
formData.append("weather", weather);
formData.append("writer", writer);
formData.append("worker", worker);
formData.append("crops", crops);

images.forEach((img) => {
  formData.append("images", img);
});

axios.post(`${baseURL}/diary`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
})
.then(res => console.log("성공:", res))
.catch(err => console.error("에러:", err));
