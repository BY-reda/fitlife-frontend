const getImageUrl = (path) => {
  const backendBaseUrl =
    process.env.NODE_ENV === "production"
      ? "https://fitlife-backend-production-f043.up.railway.app"
      : "http://localhost:5000";

  return `${backendBaseUrl}/${path.replace(/^\/+/, "")}`;
};

export default getImageUrl;
