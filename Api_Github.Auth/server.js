import app from "./app";
app.listen(process.env.PORT)

if (process.env.env !== "test") {
  const PORT = process.env.PORT || 8000;
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}