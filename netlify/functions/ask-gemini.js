// Archivo: netlify/functions/ask-gemini.js

exports.handler = async function (event, context) {
  // Miga de pan 1: La función ha sido llamada.
  console.log("Function invoked!");

  if (event.httpMethod !== 'POST') {
    console.log("Method not allowed:", event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Miga de pan 2: Vamos a intentar leer la clave secreta.
  const API_KEY = process.env.GEMINI_API_KEY;

  // Miga de pan 3: ¿Encontramos la clave secreta?
  if (!API_KEY) {
    console.error("¡ERROR CRÍTICO! La variable de entorno GEMINI_API_KEY no se encontró.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error de configuración del servidor: falta la clave API.' }),
    };
  }
  // Si la encontramos, mostramos solo los primeros 4 caracteres por seguridad.
  console.log("Clave API cargada con éxito (primeros 4 caracteres):", API_KEY.substring(0, 4));

  try {
    const { prompt } = JSON.parse(event.body);
    console.log("Pregunta recibida:", prompt);

    if (!prompt) {
      console.log("Solicitud incorrecta: no se proporcionó ninguna pregunta.");
      return { statusCode: 400, body: 'Por favor, proporciona una pregunta.' };
    }

    const fullPrompt = `Eres un experto en historia de la música. Responde la siguiente pregunta de forma concisa y educativa, en español: "${prompt}"`;

    // Miga de pan 4: Estamos a punto de llamar a Google.
    console.log("Llamando a la API de Google...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "contents": [{
          "parts": [{
            "text": fullPrompt
          }]
        }]
      })
    });
    
    // Miga de pan 5: Google nos ha respondido. ¿Qué nos dijo?
    console.log("Estado de la respuesta de Google:", response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("¡ERROR DE GOOGLE!", response.status, errorBody);
      throw new Error('Error en la respuesta de la API de Google');
    }

    const data = await response.json();
    const geminiText = data.candidates[0].content.parts[0].text;
    console.log("Respuesta generada por Gemini con éxito.");

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: geminiText }),
    };

  } catch (error) {
    console.error("Error dentro del bloque try-catch:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Hubo un error en el servidor.' }),
    };
  }
};