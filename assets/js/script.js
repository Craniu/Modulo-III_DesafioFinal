async function obtenerDatos() {
  try {
    const res = await fetch("https://mindicador.cl/api");
    const datos = await res.json();
    return datos;
  } catch (error) {
    alert(error);
  }
}
async function llenarLista() {
  const htmlLista = document.querySelector("#inMoneda");
  try {
    const mindicador = await obtenerDatos();
    Object.keys(mindicador).forEach((clave) => {
      const moneda = mindicador[clave];
      if (moneda.nombre) {
        htmlLista.innerHTML += `
                <option value="${moneda.codigo}">${moneda.nombre}</option>
            `;
      }
    });
  } catch (error) {
    alert(error.message);
  }
}
llenarLista();

const btnConvertir = document.querySelector("#btnConvertir");
btnConvertir.addEventListener("click", async () => {
  const valor = document.querySelector("#inPesos").value;
  const codigo = document.querySelector("#inMoneda").value;
  console.log(codigo);
  try {
      const mindicador = await obtenerDatos();
      const base = mindicador[codigo].valor;
      const total = valor / base;
      const resultado = document.querySelector("#textResultado");
      resultado.innerHTML = `
      Resultado : ${total} ${codigo}
      `;
    } catch (error) {
    alert(error.message);
  }
  const monedaSeleccionada = document.querySelector("#inMoneda").value;
    const res = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}`);
    console.log(`https://mindicador.cl/api/${monedaSeleccionada}`);
    
    const datos = await res.json();

    // Extraer las fechas y valores de la serie
    const labels = datos.serie.map((dia) => dia.fecha.split("T")[0]); // Formatear fecha
    const data = datos.serie.map((dia) => Number(dia.valor));

    // Crear datasets para el gráfico
    const datasets = [
        {
            label: `Valor de ${monedaSeleccionada}`,
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];

    const datia = { labels, datasets };
    
    // Configuración del gráfico
    const config = {
        type: "line",
        datia
    };

    // Seleccionar el elemento canvas
    const myChart = document.getElementById("myChart");

    // Crear el gráfico
    new Chart(myChart, config);
});






