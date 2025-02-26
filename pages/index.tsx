export default function Home() {
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response: ", data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section>
      <h1>Upload Image To S3 🚀</h1>
      <input type="file" onChange={handleFileUpload} />
    </section>
  );
}
