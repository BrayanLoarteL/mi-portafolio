const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  try {
    // Inicializar el acceso a los Blobs (almacenamiento)
    const store = getStore("portfolio-data");

    // Obtener los likes actuales (por defecto 42 si no existe)
    let currentLikes = parseInt(await store.get("likes")) || 42;

    // Si es una petición POST, significa que alguien dio like
    if (event.httpMethod === "POST") {
      currentLikes++;
      await store.set("likes", currentLikes.toString());
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Permitir peticiones desde cualquier origen (CORS)
      },
      body: JSON.stringify({ likes: currentLikes }),
    };
  } catch (error) {
    console.error("Error en función de likes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "No se pudo conectar con el contador de likes" }),
    };
  }
};
